#!/usr/bin/env python
from setuptools import find_packages, setup

requires = []
with open('requirements.txt', 'rt') as f:
    requires = f.read().split()

setup(
    name='IMCT',
    version='1.0',
    packages=find_packages(),
    package_data={
        '': ['*.xml', 'data/*.*']
    },
    include_package_data=True,
    description='',
    scripts=['imctapp.py'],
    install_requires=requires,
    classifiers=[
        'Environment :: Web Environment',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.6',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content'
    ]
)
