env.HL_BUILD_MODE = "jenkins"

node('Lithium'){
    
   stage('get new version to repo') {
       checkout scm
       if (lastCommitIsBumpCommit()) {
            currentBuild.result = 'ABORTED'
            error('Последний коммит - результат сборки jenkins')
        }
        bat "git checkout ${env.BRANCH_NAME}"
        bat "git checkout -- ."
        bat "git pull"
        bat "git submodule update --init --recursive"
        bat "git submodule update --remote --merge"
   }
   stage("build and publish"){
        sh label: '', script: 'npm i'
        sh label: '', script: 'npm run build'
    }
}
def cmd(command) {
    // при запуске Jenkins не в режиме UTF-8 нужно написать chcp 1251 вместо chcp 65001
    if (isUnix()) { sh "${command}" } else { bat "chcp 65001\n${command}"}
}

private boolean lastCommitIsBumpCommit() {
    lastCommit = bat([script: 'git log -1', returnStdout: true])
    if (lastCommit.contains("Author: jenkins")) {
        return true
    } else {
        return false
    }
}
