resource "aws_cloudfront_origin_access_control" "site" {
  name                              = local.name
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# AWS マネージドポリシー: CachingOptimized
data "aws_cloudfront_cache_policy" "optimized" {
  name = "Managed-CachingOptimized"
}

# AWS マネージドポリシー: CachingDisabled
data "aws_cloudfront_cache_policy" "disabled" {
  name = "Managed-CachingDisabled"
}

# AWS マネージドポリシー: AllViewer (ヘッダ・クッキー・クエリを全てオリジンへ渡す)
data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

locals {
  # ALB は HTTP のみのため、ブラウザから直接叩くと混在コンテンツになる。
  # CloudFront を前段に挟み、同一オリジンの /api として配信する。
  enable_api_origin = var.api_origin_domain != ""
}

# 拡張子を持たないパスを index.html に向け、SPA のルーティングを成立させる
resource "aws_cloudfront_function" "spa_rewrite" {
  name    = "${local.name}-spa-rewrite"
  runtime = "cloudfront-js-2.0"
  publish = true

  code = <<-JS
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      } else if (!uri.includes('.')) {
        request.uri = '/index.html';
      }

      return request;
    }
  JS
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.name
  default_root_object = "index.html"
  price_class         = "PriceClass_200"

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
  }

  dynamic "origin" {
    for_each = local.enable_api_origin ? [1] : []

    content {
      domain_name = var.api_origin_domain
      origin_id   = "alb-api"

      custom_origin_config {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "http-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  # ハッシュ付きファイル名で配信されるアセットは長期キャッシュする
  default_cache_behavior {
    target_origin_id       = "s3-site"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_rewrite.arn
    }
  }

  # index.html は毎回取り直させ、デプロイ後すぐ新しいアセットを指すようにする
  ordered_cache_behavior {
    path_pattern           = "/index.html"
    target_origin_id       = "s3-site"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    cache_policy_id        = data.aws_cloudfront_cache_policy.disabled.id
  }

  # /api 配下は ALB へ転送する。キャッシュは行わない
  dynamic "ordered_cache_behavior" {
    for_each = local.enable_api_origin ? [1] : []

    content {
      path_pattern             = "/api/*"
      target_origin_id         = "alb-api"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
    }
  }

  # custom_error_response はディストリビューション全体に効き、API の 404 まで
  # index.html に化けてしまう。SPA のフォールバックは default_cache_behavior に
  # 付けた CloudFront Function で URL を書き換えて実現する。

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Name = local.name }
}
