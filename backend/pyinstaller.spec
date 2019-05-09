# -*- mode: python -*-

from obspy.imaging.cm import viridis
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

block_cipher = None

_hiddenimports=collect_submodules('PyInstaller')
other_submodules = (
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

for submod in other_submodules:
	_hiddenimports.append( collect_submodules(submod) )

_datas=collect_data_files('imct')
_datas.append( ('/usr/local/lib/python3.6/site-packages/obspy/imaging/data/*.*','site-packages/obspy/imaging/data') )

a = Analysis(['imctapp.py'],
             pathex=['/opt/IMCT/backend'],
             binaries=[],
             datas=_datas,
             hiddenimports=_hiddenimports,
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='imctapp',
          debug=False,
          bootloader_ignore_signals=False,
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

