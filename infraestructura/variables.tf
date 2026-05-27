variable "environment" {
  type        = string
  description = "Target deployment environment (development, staging, production)"
  default     = "development"
}

variable "app_version" {
  type        = string
  description = "Application deployment version"
  default     = "1.0.0"
}

variable "backend_port" {
  type        = number
  description = "Port for the backend service"
  default     = 3000
}

variable "db_host" {
  type        = string
  description = "Database host address"
  default     = "localhost"
}
