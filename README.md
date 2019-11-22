# yasmine-stationxml-editor

_yasmine_  (Yet Another Station Metadata INformation Editor), a tool to
create and edit station metadata informations in FDSN stationXML format,
is a common development of IRIS and RESIF.
Development and addition of new features is shared and agreed between
IRIS and RESIF.

_Updated Nov 21, 2019_

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
    mkdir yasmine-app          (optional)
    cd yasmine-app             (substitute your directory name)
```

4.  download the yasmine-1.0.tar.gz file to an install directory

```
    curl -o yasmine-1.x.tar.gz "https://github.com/iris-edu-int/yasmine-stationxml-editor/releases/download/1.x/yasmine-1.x.tar.gz"
```

5. install yasmine using pip

```
    python -m pip install yasmine-1.x.tar.gz
``` 

6. run the database preparation script and create app directory

```
    cd <my working directory> or export YASMINE_APP_DIR=<my working directory>
    yasmine syncdb upgrade heads
```

## Instructions to run yasmine
1.  run the yasmine server (using port 8080 in this example)

```
    yasmine runserver --port 8080
    OR
    export YASMINE_TORNADO_PORT=8080
    yasmine runserver
```

2.  connect web browser to yasmine server

```
    http://localhost:8080
```

## environment variables -- optional to set, otherwise a default value is used

```
YASMINE_APP_DIR - this is where the application's run time files such as logs and the db can be found
	default: current working directory when the application is run
	set to:  a filesystem directory name that will serve as a static location for app files regardless of current working directory

YASMINE_DB_FILE - the location of the sqlite database for yasmine
	default: located at the location of the application code install + 'db.sqlite'
	set to:  a file name with a .sqlite suffix that serves as a static reference to the database for yasmine

YASMINE_TORNADO_HOST - the tornado server hostname
	default: localhost
	set to:  a host name where the yasmine backend service can be found in a URL

YASMINE_TORNADO_PORT - the tornado server port number
    default: 80
    set to:  a port number where the yasmine backend service can be found in a URL

YASMINE_NRL_URL - The (presumably) remote URL where the source Nominal Response Library download can be found
	default: http://ds.iris.edu/NRL/IRIS.zip
	set to:  a URL where the desired NRL download can be found
```


## Instructions to develop -- may be out of date
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
v1.0 of yasmine originally created by Instrumental Software Technologies, Inc. (ISTI) under contract with IRIS

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
