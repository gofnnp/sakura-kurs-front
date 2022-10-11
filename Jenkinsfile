env.HL_BUILD_MODE = "jenkins"

node('Lithium'){
    
   stage('get new version to repo') {
       checkout scm
       if (lastCommitIsBumpCommit()) {
            currentBuild.result = 'ABORTED'
            error('Последний коммит - результат сборки jenkins')
        }
        sh "git checkout ${env.BRANCH_NAME}"
        sh "git checkout -- ."
        
        sh "git pull"
        //sh "git submodule update --init --recursive"
        //sh "git submodule update --remote --merge"
   }
   stage("build and publish"){
        dir('angular'){
            sh label: '', script: 'npm i'
            sh label: '', script: 'npm run build'
        }
    }
}

private boolean lastCommitIsBumpCommit() {
    lastCommit = sh([script: 'git log -1', returnStdout: true])
    if (lastCommit.contains("Author: jenkins")) {
        return true
    } else {
        return false
    }
}
