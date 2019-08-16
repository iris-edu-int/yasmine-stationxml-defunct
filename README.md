# yasmine-stationxml-editor

_yasmine_  (Yet Another Station Metadata INformation Editor), a tool to
create and edit station metadata informations in FDSN stationXML format,
is a common development of IRIS and RESIF.
Development and addition of new features is shared and agreed between
IRIS and RESIF.

## Requirements
1. Python 3.6.5 or later
2. pip
3. miniconda or anaconda  (optional)

## Instructions to install yasmine
### install miniconda (optional) for a controlled environment
1.  install miniconda:  https://docs.conda.io/en/latest/miniconda.html
2.  setup a new environment (yasmine-env) for Python 3.6.5 and activate it

```
    conda create -n yasmine-env python=3.6.5
    source activate yasmine-env
```

### continue with pip install of yasmine
3.  create and/or change to directory for installing yasmine
```
    mkdir yasmine          (optional)
    cd yasmine             (substitute your directory name)
```

4.  download the latest yasmine-1.x.tar.gz file and the latest IRIS.zip from the Nominal Response Library at IRIS DMC

```
    curl -o yasmine-1.x.tar.gz "http://https://github.com/iris-edu-int/yasmine-stationxml-editor/releases/download/1.x/yasmine-1.x.tar.gz"
    curl -o IRIS.zip "http://ds.iris.edu/NRL/IRIS.zip"
```

5. install yasmine using pip

```
    python -m pip install yasmine-1.x.tar.gz
``` 

6. run the database preparation script

```
    yasmine syncdb upgrade heads
```

## Instructions to run yasmine
1.  change directory to yasmine install

```
    cd yasmine
```

2.  run the yasmine server (using port 8080 in this example)

```
    yasmine runserver --port 8080
```

3.  connect web browser to yasmine server

```
    http://localhost:8080
```


## Instructions to develop #
### Common ##
#### Create or modify database definition
1. Run ``python yasmine.py syncdb revision --autogenerate`` to create migration script
2. Run ``python yasmine.py syncdb upgrade heads`` to migrate database

#### Instructions to install selenium firefox driver - needed for the testing
1. Download driver from ``https://github.com/mozilla/geckodriver/releases``
2. Unpack and add to the system paths   

#### Run tests
1. Start application ``python yasmine.py test``

#### Build UI
1. Install Sencha Cmd
2. Run ``sencha app build`` from source 'frontend' folder

#### Build distribution package
1. Run ``python setup.py sdist`` from source 'backend' folder

### Using Docker
#### Start application containers
1. Run ``docker-compose up`` to download, build and deploy docker container.
2. Open browser and type ``http://localhost:1841``.

#### Instructions to debug backend
1. Start application containers (see previous instructions).
2. Run ``docker attach yasmine-backend`` to download, build and deploy docker container.
3. Set breakpoint ``import pdb;pdb.set_trace()`` and call url.

#### Instructions to use sencha cmd ###
1. Start docker containers (see previous instructions).
2. Run ``docker-compose exec yasmine-frontend bash`` to open terminal
3. Run ``sencha app build`` to build UI

## Credits
v1.0 of yasmine originally created by Instrumental Software Technologies under contract with IRIS
v2.0 of yasmine is currently pending at time of this release

## License
yasmine is released under the Lesser GNU Public License v3

yasmine  (Yet Another Station Metadata INformation Editor), a tool to
create and edit station metadata informations in FDSN stationXML format,
is a common development of IRIS and RESIF.
Development and addition of new features is shared and agreed between
IRIS and RESIF.

Version 1.0 of the software was funded by SAGE, a major facility fully
funded by the National Science Foundation (EAR-1261681-SAGE),
development done by ISTI and led by IRIS Data Services.
Version 2.0 of the software was funded by CNRS and development led by
RESIF.

This program is free software; you can redistribute it
and/or modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be
useful, but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License (GNU-LGPL) for more details.

You should have received a copy of the GNU Lesser General Public
License along with this software. If not, see
<https://www.gnu.org/licenses/>
