# -*- mode: python -*-

from obspy.imaging.cm import viridis
from PyInstaller.utils.hooks import collect_submodules, collect_data_files

block_cipher = None

#was:             hiddenimports=[],
_hiddenimports=collect_submodules('scipy')
_datas=collect_data_files('imct')
_datas.append( ('/usr/local/lib/python3.6/site-packages/obspy/imaging/data/*.*','site-packages/obspy/imaging/data') )

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

