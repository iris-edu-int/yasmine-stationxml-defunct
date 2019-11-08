from yasmine import __main__

def main(args):
    print("-- yasmine init --")
    if (len(args) > 1):
        args = args[1:]
    __main__.main(args)