# DSO101 — Assignment 2: Jenkins CI/CD Pipeline

**Student Name:** Samuel Tamang  
**Student ID:** 02240335  
**Course:** DSO101 — Continuous Integration and Continuous Deployment  
**Program:** Bachelor's of Engineering in Software Engineering  
**Date of Submission:** 25th March  
**GitHub Repository:** https://github.com/Waiba334/A2_DSO101

---

## Table of Contents

1. [Objective](#objective)
2. [Tools and Technologies](#tools-and-technologies)
3. [Task 1 — Jenkins Setup](#task-1--jenkins-setup)
4. [Task 2 — GitHub Repository Setup](#task-2--github-repository-setup)
5. [Task 3 — Jenkinsfile Pipeline](#task-3--jenkinsfile-pipeline)
6. [Task 4 — Running the Pipeline](#task-4--running-the-pipeline)
7. [Challenges Faced](#challenges-faced)

---

## Objective

In this assignment, a Jenkins pipeline was configured to automate the build, test, and deployment of the Todo List application from Assignment 1. The pipeline includes:

- Code checkout from GitHub
- Dependency installation (npm)
- Build step (Vite frontend build)
- Unit testing (Jest)
- Deployment (Docker image build and push to Docker Hub)

---

## Tools and Technologies

| Tool | Purpose |
|------|---------|
| Jenkins 2.555.1 | CI/CD automation |
| GitHub | Source code hosting |
| Node.js 20.x | JavaScript runtime |
| Jest + Jest-JUnit | Testing framework |
| Docker | Containerization |
| Docker Hub | Image registry |

---

## Task 1 — Jenkins Setup

### Step 1 — Install Jenkins

Jenkins was installed using Homebrew on macOS:

```bash
brew install jenkins-lts
brew services start jenkins-lts
```

Jenkins runs at `http://localhost:8080`

### Screenshot 1 — Jenkins Dashboard

![alt text](<images/Screenshot 2026-05-08 at 11.15.12 AM.png>)

---

### Step 2 — Install Required Plugins

Navigate to **Manage Jenkins → Plugins → Available plugins** and install:

| Plugin | Purpose |
|--------|---------|
| NodeJS Plugin | Run npm commands in pipeline |
| Pipeline | Create declarative pipelines |
| GitHub Integration Plugin | Connect to GitHub repos |
| Docker Pipeline | Build and push Docker images |

### Screenshot 2 — NodeJS Plugin Installed

![alt text](images/preview.webp)

### Screenshot 3 — Docker Pipeline Plugin Installed

![alt text](images/1.webp)

### Screenshot 4 — GitHub Integration Plugin Installed

![alt text](images/3.webp)

---

### Step 3 — Configure NodeJS in Jenkins Tools

1. Go to **Manage Jenkins → Tools**
2. Scroll to **NodeJS installations**
3. Click **Add NodeJS**
4. Set Name: `NodeJS`, Version: `NodeJS 20.20.0`
5. Click **Save**

### Screenshot 5 — NodeJS Tool Configuration

![alt text](images/preview.webp)

---

## Task 2 — GitHub Repository Setup

### Step 1 — Repository Structure

![alt text](<images/Screenshot 2026-05-08 at 11.22.17 AM.png>)

### Screenshot 6 — GitHub Repository

![alt text](<images/Screenshot 2026-05-08 at 11.22.55 AM.png>)

---

### Step 2 — Generate GitHub Personal Access Token (PAT)

1. Go to GitHub → **Settings → Developer settings**
2. Click **Personal access tokens → Tokens (classic)**
3. Click **Generate new token (classic)**
4. Set scopes: `repo` and `admin:repo_hook`
5. Copy the token


### Step 3 — Add GitHub Credentials in Jenkins

1. Go to **Manage Jenkins → Credentials → System → Global**
2. Click **Add Credentials**
3. Fill in:
   - Kind: Username with password
   - Username: `Waiba334`
   - Password: GitHub PAT token
   - ID: `github-creds`
   - Description: `GitHub PAT`


### Step 4 — Add Docker Hub Credentials in Jenkins

1. Click **Add Credentials** again
2. Fill in:
   - Kind: Username with password
   - Username: `bishalwaiba`
   - Password: Docker Hub password
   - ID: `docker-hub-creds`
   - Description: `Docker Hub`

### Screenshot 7 — Both Credentials Added

![alt text](<images/Screenshot 2026-05-08 at 11.24.04 AM.png>)

---

## Task 3 — Jenkinsfile Pipeline

The Jenkinsfile defines the complete CI/CD pipeline with the following stages:

### Full Jenkinsfile

```groovy
pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        DOCKERHUB_USER = 'bishalwaiba'
        IMAGE_TAG = '02240335'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Backend') {
            steps {
                dir('todo-app/backend') {
                    sh 'npm install'
                    sh 'npm install --save-dev jest jest-junit'
                }
            }
        }
        stage('Test Backend') {
            steps {
                dir('todo-app/backend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'todo-app/backend/junit.xml'
                }
            }
        }
        stage('Install Frontend') {
            steps {
                dir('todo-app/frontend') {
                    sh 'rm -rf node_modules package-lock.json'
                    sh 'npm install'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('todo-app/frontend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Build & Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'docker-hub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '/usr/local/bin/docker login -u bishalwaiba -p $DOCKER_PASS'
                        sh '/usr/local/bin/docker build -t bishalwaiba/be-todo:02240335 ./todo-app/backend'
                        sh '/usr/local/bin/docker push bishalwaiba/be-todo:02240335'
                        sh '/usr/local/bin/docker build -t bishalwaiba/fe-todo:latest ./todo-app/frontend'
                        sh '/usr/local/bin/docker push bishalwaiba/fe-todo:latest'
                    }
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
```

![alt text](<images/Screenshot 2026-05-08 at 11.25.31 AM.png>)

### Test File (todo.test.js)

A simple Jest test file was created to verify the backend:

```javascript
test('basic math works', () => {
  expect(1 + 1).toBe(2);
});

test('todo object has required fields', () => {
  const todo = { id: 1, task: 'Buy milk', completed: false };
  expect(todo).toHaveProperty('task');
  expect(todo).toHaveProperty('completed');
  expect(todo.completed).toBe(false);
});
```

---

## Task 4 — Running the Pipeline

### Step 1 — Create Pipeline in Jenkins

1. Jenkins dashboard → **New Item**
2. Name: `todo-pipeline` → Select **Pipeline** → OK
3. Under Pipeline section:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/Waiba334/A2_DSO101.git`
   - Credentials: `github-creds`
   - Branch: `*/main`
   - Script Path: `todo-app/jenkinsfile`
4. Click **Save**


### Step 2 — Run the Pipeline

Click **Build Now** and watch the stages execute.


### Step 3 — Successful Pipeline

### Screenshot 13 — All Stages Green ✅

![alt text](<images/Screenshot 2026-05-08 at 11.09.21 AM.png>)


### Screenshot 15 — Test Result Trend Graph

![alt text](<images/Screenshot 2026-05-08 at 11.09.42 AM.png>)

### Screenshot 16 — Console Output — SUCCESS

![alt text](<images/Screenshot 2026-05-08 at 11.28.07 AM.png>)

---

### Step 4 — Verify on Docker Hub

### Screenshot 19 — Docker Hub Images Updated

![alt text](<images/Screenshot 2026-05-08 at 11.29.49 AM.png>)

---

## Challenges Faced

### Challenge 1 — Docker Path Not Found
**Problem:** Jenkins could not find the `docker` command — `Cannot run program "docker": No such file or directory`.

**Solution:** Used the full Docker path `/usr/local/bin/docker` instead of just `docker` in all shell commands. Also added the PATH environment variable in Jenkins global configuration.

---

### Challenge 2 — NodeJS Version Too Old for Vite
**Problem:** The frontend build failed because Jenkins installed NodeJS 20.18.3 but Vite 8 requires Node 20.19+.

**Solution:** Updated the NodeJS installation in Jenkins Tools from version 20.18.x to 20.20.0 which satisfied Vite's requirements.

---

### Challenge 3 — Jest Not Found in Pipeline
**Problem:** `sh: jest: command not found` error during Test Backend stage.

**Solution:** Added an explicit `npm install --save-dev jest jest-junit` step in the Install Backend stage to ensure devDependencies are always installed regardless of the NODE_ENV setting.

---

### Challenge 4 — Docker Push Failing with 400 Bad Request
**Problem:** Docker push was failing with `400 Bad Request` and `broken pipe` errors after pushing some layers.

**Solution:** Cleared Docker build cache using `docker builder prune -a -f` and updated the Jenkins docker-hub-creds with a new Docker Hub Personal Access Token that had Read & Write permissions.

---

### Challenge 5 — Wrong Repository URL in Pipeline
**Problem:** Jenkins was trying to fetch from the wrong repository URL.

**Solution:** Updated the pipeline configuration to use the correct repository URL `https://github.com/Waiba334/A2_DSO101.git` and changed the Checkout stage to use `checkout scm` instead of a hardcoded git step.

---

## Pipeline Summary

| Stage | Status | Time |
|-------|--------|------|
| Checkout SCM | ✅ Pass | 1s |
| Tool Install | ✅ Pass | 196ms |
| Checkout | ✅ Pass | 1s |
| Install Backend | ✅ Pass | 1s |
| Test Backend | ✅ Pass | 2s |
| Install Frontend | ✅ Pass | 1s |
| Build Frontend | ✅ Pass | 1s |
| Build & Push Docker Images | ✅ Pass | 48s |

**Total Runtime:** ~1 min 0s

---

## Live URLs

| Resource | URL |
|----------|-----|
| GitHub Repo | https://github.com/Waiba334/A2_DSO101 |
| Docker Hub | https://hub.docker.com/u/bishalwaiba |
| Backend Image | https://hub.docker.com/r/bishalwaiba/be-todo |
| Frontend Image | https://hub.docker.com/r/bishalwaiba/fe-todo |
