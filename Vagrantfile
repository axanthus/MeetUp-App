# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"
  config.vm.box_check_update = false
  config.vm.disk :disk, size: "30GB", primary: true

  config.vm.network "forwarded_port", guest: 4000, host: 4000

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine and only allow access
  # via 127.0.0.1 to disable public access
  # config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    vb.name = "Project"

    vb.gui = true
    vb.memory = 5120
    vb.vram = 128
    vb.cpus = 2

  end

  config.vm.provision "shell", inline: <<-SHELL
    sudo -i
    apt-get update
    apt-get install -y apache2
    apt-get install -y docker.io
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    apt install -y nodejs
    npm install react-icons -g
    git init
    git remote add origin "https://github.com/KrithikNaralasetty/CloudComputingTermProject.git"
    git pull origin main
    bash ./docker_init.sh
  SHELL
end
