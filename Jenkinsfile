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
            steps {
                node('docker1') {
                    unstash 'app_src'
                    def frontEnd = docker.build("frontend-test", "./frontend") 
                    frontEnd.inside {
                        sh 'sencha app build'
                    }
                    def backEnd = docker.build("backend-test", "./backend") 
                    backEnd.inside {
                        sh 'imctapp.py syncdb upgrade heads'
                    }
                }
            }
        }
    }
}
