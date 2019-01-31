pipeline {
    agent none
    stages {
        stage('clone') {
            steps {
            checkout(
                        [$class: 'GitSCM', branches: [[name: '*/v1_iris_jenkins']], 
                        doGenerateSubmoduleConfigurations: false, 
                        extensions: [], 
                        submoduleCfg: [], 
                        userRemoteConfigs: [[name: 'twister', url: 'https://github.com/iris-edu-int/twister-imct-editor.git']]]
                    )
            sh 'env'
            }
        }
        stage('build') {
            steps {
                node('docker1') {
                    agent {
                        dockerfile {
                           filename 'Dockerfile'
                           dir 'frontend'
                           label 'frontend-test'
                           //additionalBuildArgs  '--build-arg version=1.0.2'
                           //args '-v /tmp:/tmp'
                        }
                    }
                    sh 'sencha app build'
                    agent {
                        dockerfile {
                           filename 'Dockerfile'
                           dir 'backend'
                           label 'backend-test'
                           //additionalBuildArgs  '--build-arg version=1.0.2'
                           //args '-v /tmp:/tmp'
                        }
                    }
                    sh 'imctapp.py syncdb upgrade heads'
                }
            }
        }
    }
}



