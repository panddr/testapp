Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--cpuexecutioncap", "50"]
    v.gui = false
  end

 
  config.vm.define "denden",primary: true do |denden|
    denden.vm.hostname="server"
    denden.vm.provision "ansible" do |ansible|
      ansible.playbook = "ansible/playbook.yml"
    end
    denden.vm.network "private_network", ip: "192.168.80.19"
  end
end