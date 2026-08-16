output "s3_bucket" {
  description = "GitHub Actions の AWS_S3_BUCKET シークレットに設定する値"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_distribution_id" {
  description = "GitHub Actions の AWS_CLOUDFRONT_DISTRIBUTION_ID シークレットに設定する値"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_url" {
  description = "公開 URL。Laravel 側の frontend_url に設定する"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "github_deploy_role_arn" {
  description = "GitHub Actions の AWS_ROLE_ARN シークレットに設定する値"
  value       = aws_iam_role.github_deploy.arn
}
