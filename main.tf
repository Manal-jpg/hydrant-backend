provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_network" "app_network" {
  name = "app-network"
}

resource "docker_image" "nestjs_image" {
  name = "hydrant-backend:latest"
}

resource "docker_image" "react_image" {
  name = "hydrant-frontend:latest"
}

resource "docker_container" "nestjs_container" {
  name    = "hydrant-backend"
  image   = docker_image.nestjs_image.latest
  networks_advanced {
    name = docker_network.app_network.name
  }
  ports {
    internal = 3000
    external = 3000
  }
  restart = "always"
}

resource "docker_container" "react_container" {
  name    = "hydrant-frontend"
  image   = docker_image.react_image.latest
  networks_advanced {
    name = docker_network.app_network.name
  }
  ports {
    internal = 5173
    external = 5173
  }
  restart = "always"
}