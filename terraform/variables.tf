variable "aws_region" {
  description = "S3 バケットを作成するリージョン"
  type        = string
  default     = "ap-northeast-1"
}

variable "project" {
  description = "リソース名のプレフィックス"
  type        = string
  default     = "todo-frontend-v2"
}

variable "environment" {
  description = "環境名"
  type        = string
  default     = "prod"
}

variable "github_repository" {
  description = "OIDC で信頼する GitHub リポジトリ (owner/repo)"
  type        = string
  default     = "KadoProG/todo-frontend-react-v2"
}

# GitHub OIDC プロバイダは AWS アカウントに 1 つしか作れない。
# laravel-todo-app-v2 側で作成する前提のため、既定では参照のみ行う。
variable "api_origin_domain" {
  description = "API を配信する ALB のドメイン名 (例: xxx.ap-northeast-1.elb.amazonaws.com)。空の場合は /api の転送を作らない"
  type        = string
  default     = ""
}

variable "create_github_oidc_provider" {
  description = "アカウント内に GitHub OIDC プロバイダを新規作成するか。既に存在する場合は false"
  type        = bool
  default     = false
}
