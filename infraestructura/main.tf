# Terraform configuration for Monorepo Infrastructure (Modified to trigger pipeline)

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.1.0"
    }
  }
}

provider "local" {}

# Simulated Frontend static bucket
resource "local_file" "frontend_deployment_marker" {
  filename = "${path.module}/dist_infra/frontend_status.txt"
  content  = "frontend-deployed-via-terraform\nEnvironment: ${var.environment}\nVersion: ${var.app_version}"
}

# Simulated Backend container configuration
resource "local_file" "backend_config" {
  filename = "${path.module}/dist_infra/backend_env.conf"
  content  = <<EOF
PORT=${var.backend_port}
NODE_ENV=${var.environment}
DB_HOST=${var.db_host}
EOF
}
