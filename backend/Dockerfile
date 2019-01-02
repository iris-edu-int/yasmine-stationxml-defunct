FROM python:3.6.5-slim
ADD . /opt/IMCT/src
WORKDIR /opt/IMCT/src

RUN apt-get update && apt-get install -y wget unzip gnupg

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt-get -y install google-chrome-stable

RUN cd /tmp && \
    wget https://chromedriver.storage.googleapis.com/2.39/chromedriver_linux64.zip -O chromedriver.zip --progress=bar:force && \
    mkdir /opt/chromedriver && unzip -q -p chromedriver.zip > /opt/chromedriver/chromedriver && \
    ln -s /opt/chromedriver/chromedriver /usr/local/bin/chromedriver && \
    rm chromedriver.zip && \
    chmod +x /opt/chromedriver/chromedriver

RUN pip install -r requirements.txt
CMD python imctapp.py syncdb upgrade heads ; python imctapp.py runserver --debug

