# -*- mode: python -*-

from obspy.imaging.cm import viridis
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

block_cipher = None

_hiddenimports=collect_submodules('PyInstaller',
'alembic',
'altgraph',
'apscheduler',
'certifi',
'chardet',
'dateutil',
'future',
'humanize',
'idna',
'jsonpickle',
'libfuturize',
'libpasteurize',
'lxml',
'macholib',
'mako',
'markupsafe',
'matplotlib',
'mpl_toolkits',
'numpy',
'obspy',
'ordlookup',
'past',
'pytz',
'requests',
'scipy',
'selenium',
'setuptools',
'slugify',
'sqlalchemy',
'tornado',
'tzlocal',
'unidecode',
'urllib3',
'wheel')

_datas=collect_data_files('imct')

a = Analysis(['/Applications/Anaconda/anaconda3/envs/imct-env/bin/imctapp.py'],
             pathex=['/Users/rob/isti-devel/pyinstaller'],
             binaries=[],
             datas=_datas,
             hiddenimports=_hiddenimports,
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          exclude_binaries=True,
          name='imctapp',
          debug=True,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               name='imctapp')

