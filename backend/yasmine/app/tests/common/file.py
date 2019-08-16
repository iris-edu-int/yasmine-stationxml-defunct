import codecs
import os


class FileTestMixin(object):
    FILES_FOLDER = ""

    def get_data(self, file_name):
        with codecs.open(os.path.join(self.FILES_FOLDER, file_name), "r", encoding='utf-8') as f:
            return f.read()

    def set_data(self, file_name, data):
        with open(os.path.join(self.FILES_FOLDER, file_name), "wb") as f:
            f.write(data)
