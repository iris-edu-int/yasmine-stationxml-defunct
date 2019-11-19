from yasmine import __main__

def main(args):
    print("-- yasmine init --")
    if (len(args) == 0):
        args = "NO ARGS"
    __main__.main(args)