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
