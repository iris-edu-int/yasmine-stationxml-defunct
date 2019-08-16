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
                    userRemoteConfigs: [[name: 'yasmine', url: 'https://github.com/iris-edu-int/yasmine-stationxml-editor.git']]]
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
			sh "sudo docker image prune -f"
			try {
				sh "sudo docker rmi frontend-test"
			} catch (err) {
				echo err.getMessage()
				echo "Error detected, but we will continue."
			}
			try {
				sh "sudo docker rmi backend-test"
			} catch (err) {
				echo err.getMessage()
				echo "Error detected, but we will continue."
			}
                        sh "sudo docker build -t frontend-test -f frontend/Dockerfile.jenkins ./frontend"
                        sh "sudo docker build -t backend-test -f backend/Dockerfile.jenkins ./backend"
			try {
				sh "chmod -fR 777 . frontend backend | sudo docker run -i --rm --user=\"jenkins\" -w=\"/home/jenkins\" --volume /local_builds/workspace/yasmine:/opt/yasmine frontend-test bash"
			} catch (err) {
				echo err.getMessage()
				echo "Error detected on frontend chmod, but we will continue."
			}
			sh "echo 'cd /opt/yasmine/frontend; sencha app build' | sudo docker run -i --rm --user=\"jenkins\" -w=\"/home/jenkins\" --volume /local_builds/workspace/yasmine:/opt/yasmine frontend-test bash"
                        sh "echo 'cd /opt/yasmine/backend; python setup.py sdist; pyinstaller -y pyinstaller.spec' | sudo docker run -i --rm --user=\"jenkins\" -w=\"/home/jenkins\" --volume /local_builds/workspace/yasmine:/opt/yasmine backend-test bash"
                    }
                }
            }
        }
    }
}
