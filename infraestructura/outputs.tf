output "frontend_marker_path" {
  description = "Path to the frontend deployment marker file"
  value       = local_file.frontend_deployment_marker.filename
}

output "backend_config_path" {
  description = "Path to the backend environment config file"
  value       = local_file.backend_config.filename
}
