# IMCT

IMCT (instrumentation metadata construction tool) is a python web application developed to generate metadata XML for a seismic stations.

## Requirements
1. Installed Python 3.6.5+
2. Related python packages will be installed automatically by pip

## Instructions to install (under super user rights)
1. Install a source distribution package ``pip install IMCT-x.x.tar.gz``
2. Update database ``python imctapp.py syncdb upgrade heads``
3. If there is no internet connection unzip NRL (IRIS.zip) in to the application data folder "/opt/IMCT/_media/" or "c:/IMCT/_media/nrl/" depending on OS (Linux/Windows based).
4. Start application ``python imctapp.py runserver``

## Instructions to develop #
### Common ##
#### Create or modify database definition
1. Run ``python imctapp.py syncdb revision --autogenerate`` to create migration script
2. Run ``python imctapp.py syncdb upgrade heads`` to migrate database

#### Instructions to install selenium firefox driver - needed for the testing
1. Download driver from ``https://github.com/mozilla/geckodriver/releases``
2. Unpack and add to the system paths   

#### Run tests
1. Start application ``python imctapp.py test``

#### Build UI
1. Install Sencha Cmd
2. Run ``sencha app build`` from source 'frontend' folder

#### Build distribution package
1. Run ``python setup.py sdist`` from source 'backend' folder

### Using dockers
#### Start application containers
1. Run ``docker-compose up`` to download, build and deploy docker container.
2. Open browser and type ``http://localhost:1841``.

#### Instructions to debug backend
1. Start application containers (see previous instructions).
2. Run ``docker attach imct-backend`` to download, build and deploy docker container.
3. Set breakpoint ``import pdb;pdb.set_trace()`` and call url.

#### Instructions to use sencha cmd ###
1. Start docker containers (see previous instructions).
2. Run ``docker-compose exec imct-frontend bash`` to open terminal
3. Run ``sencha app build`` to build UI
