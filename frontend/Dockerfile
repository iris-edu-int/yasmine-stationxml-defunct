FROM openjdk:8-jre-stretch

RUN apt-get update && \
    apt-get install -y wget unzip
        
RUN useradd -m sencha && \
    cd && cp -R .bashrc .profile /home/sencha && \
    mkdir -p /code /opt/Sencha/SDK /opt/Sencha/Cmd/6.5.3.6 && \
    chown -R sencha:sencha /home/sencha /code /opt/Sencha

USER sencha
ENV HOME /home/sencha

RUN cd /home/sencha && \
	wget http://cdn.sencha.com/cmd/6.5.3.6/no-jre/SenchaCmd-6.5.3.6-linux-amd64.sh.zip -O senchacmd.zip --progress=bar:force && \
	unzip -q -p senchacmd.zip > SenchaCmd-6.5.3.6-linux-amd64.sh && \
	rm senchacmd.zip && \
	chmod +x SenchaCmd-6.5.3.6-linux-amd64.sh
	
RUN /home/sencha/SenchaCmd-6.5.3.6-linux-amd64.sh -q -dir /opt/Sencha/Cmd/6.5.3.6 -Dall=true
RUN rm /home/sencha/SenchaCmd-6.5.3.6-linux-amd64.sh && chmod +x /opt/Sencha/Cmd/6.5.3.6/sencha

RUN cd opt/Sencha/SDK && wget http://cdn.sencha.com/ext/gpl/ext-6.2.0-gpl.zip --progress=bar:force && unzip -q ext-6.2.0-gpl.zip

ENV PATH="$PATH:/opt/Sencha/Cmd/6.5.3.6"
WORKDIR /code/frontend
CMD sencha app watch --j2ee
