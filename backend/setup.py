#!/usr/bin/env python
from setuptools import find_packages, setup

requires = []

with open('requirements.txt', 'rt') as f:
    requires = f.read().split()

module_name = 'yasmine'

setup(
    name='yasmine',
    version='1.0',
    packages=find_packages(),
    package_data={
        '': ['*.xml', 'data/*.*']
    },
    include_package_data=True,
    description='',
    entry_points={
        'console_scripts': [
            '%s = %s:main(sys.argv[1:])' % (module_name, module_name),
        ],
    },
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
