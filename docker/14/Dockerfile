# This is a comment
FROM ubuntu:14.04
MAINTAINER Josh Wilson <joshuef@gmail.com>
# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# make sure apt is up to date
RUN apt-get update --fix-missing
RUN apt-get install -y curl
RUN apt-get install -y build-essential libssl-dev


ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.3.1
# RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.7/install.sh | bash
# RUN command -v nvm
# # RUN nvm install 6.3.1


# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.31.7/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH