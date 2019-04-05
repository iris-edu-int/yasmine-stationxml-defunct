pipeline {
    agent none
    stages {
        stage('clone') {
            agent any
            steps {
                checkout(
                    [$class: 'GitSCM', branches: [[name: '*/v1_iris_jenkins']], 
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [], 
                    submoduleCfg: [], 
                    userRemoteConfigs: [[name: 'twister', url: 'https://github.com/iris-edu-int/twister-imct-editor.git']]]
                )
                stash includes: '**/*', name: 'app_src'
            }
        }
        stage('build') {
            environment {
                frontEnd = ""
                backEnd = ""
            }
            steps {
                node('docker1') {
                    script {
                        unstash 'app_src'
                        sh "sudo docker build -t frontend-test -f frontend/Dockerfile.jenkins ./frontend"
                        sh "sudo docker build -t backend-test -f backend/Dockerfile.jenkins ./backend"
			sh "chmod -R 777 frontend backend; echo 'cd /opt/IMCT/frontend; sencha app build' | sudo docker run -i --rm --user=\"jenkins\" -w=\"/home/jenkins\" --volume /local_builds/workspace/Twister-IMCT:/opt/IMCT frontend-test bash"
                        sh "echo 'cd /opt/IMCT/backend; python setup.py sdist' | sudo docker run -i --rm --user=\"jenkins\" -w=\"/home/jenkins\" --volume /local_builds/workspace/Twister-IMCT:/opt/IMCT backend-test bash"
			sh "sudo docker image prune -f"
                    }
                }
            }
        }
    }
}
