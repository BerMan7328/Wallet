#!/bin/bash

yum update -y &&
yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm &&
yum install -y yum-utils device-mapper-persistent-data lvm2 &&
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo &&
yum install -y docker docker-compose git curl &&
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash - &&
sudo yum install -y nodejs &&
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo &&
rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg &&
yum install -y yarn &&

systemctl start docker &&
systemctl enable docker &&

docker volume create mysql_mongodb &&
docker volume create gitlab_data &&
docker volume create gitlab_logs &&
docker volume create gitlab_config &&
docker volume create gitlab-runner_config &&
docker volume create portainer_data &&
docker volume create netdata_sys &&
docker volume create netdata_proc &&

sudo sed -i 's/enforcing/disabled/g' /etc/selinux/config /etc/selinux/config &&
sudo systemctl stop firewalld &&
sudo systemctl disable firewalld &&

cd /var/lib &&
mkdir dev_ambient &&
cd /var/lib/dev_ambient &&

yarn add react &&
yarn add node &&
yarn add react-icons &&
yarn add styled-components &&
yarn add react-dom &&
yarn add react-router-dom &&
yarn add react-scripts &&
yarn add react-switch &&
yarn add typescript &&
yarn add uuidv4 &&
yarn add user-event &&
yarn add jest-dom &&

cd /tmp &&
mkdir git &&
cd /tmp/git &&
git init &&
git remote add origin https://github.com/BerMan7328/My-Wallet.git &&
git pull https://github.com/BerMan7328/My-Wallet.git master &&
cd /tmp/git/ambient &&

mv /tmp/git /var/lib/dev_ambient &&
cd /var/lib/dev_ambient &&
yarn add react-scripts &&
npx create-react-app mywallet --template typescript &&

reboot
