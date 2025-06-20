## vim的配置文件
[vim的配置文件](常用配置文件.md##vimrc)

## bash的配置文件
[bash的配置文件](常用配置文件#.bsharc文件)
常用命令

- `gg` 到文件开头
- `G` 到文件末尾
- `V` 可视化，这时进行上下换行就可以选择

## 进程管理

```bash
command & #让命令在后台运行
jobs # 查看当前的任务
fg %1 #让第一个任务回到前台
ctrl + z 是暂停任务（是暂停不是终止）
ctrl + c 终止任务
bg 让任务在后台运行，默认是刚刚终止的程序
kill 杀死任务
```

##  日常使用

ctrl-w 删除你键入的最后一个单词，ctrl-u 可以删除行内光标所在位置之前的内容，alt-b  和 alt-f 可以以单词为单位移动光标，ctrl-a 可以将光标移至行首，ctrl-e 可以将光标移至行尾，ctrl-k 可以删除光标至行尾的所有内容，ctrl-l 可以清屏

回到前一个工作路径：`cd -`

`xargs` 从标准输入读取数据，并将其作为参数传递给指定的命令。
如果未指定命令，默认使用 `echo`。
```bash
echo -e "file1\nfile2\nfile3" | xargs -I{} cp {} /backup/{}.bak
echo -e "dir1\ndir2\dir3" | xargs -I{} mkdir {}
```

`pgrep` 用于根据进程名查找进程 ID（PID）。
常用选项

- `-f`：匹配完整的命令行（而不仅仅是进程名,这样更好找）
    
- `-l`：显示进程名和 PID。
    
- `-u`：匹配特定用户的进程。
    
- `-x`：精确匹配进程名。

`pkill` 用于根据进程名向进程发送信号。

 常用选项

- **`-f`**：匹配完整的命令行。
    
- **`-u`**：匹配特定用户的进程。
    
- **`-signal`**：指定发送的信号（默认为 `TERM`）
```bash 
pkill -9 pid
pkill sleep(nginx)
pkill -f sleep
pkill -u whq
```

## conda
### conda下载安装
1. 下载对应版本的Anaconda3 比如x86系统就下载x86对应的版本
2. 执行下面的命令即可
```bash
bash Anaconda3-2024.10-1-Linux-aarch64.sh
# 将常用的一个分支加入
conda config --add channels conda-forge
conda config --set channel_priority strict
```
### 环境创建、激活、删除
```bash
conda create --name tmp python=3.9.9
conda create -n myenv python=3.9.9  

conda remove -n myenv --all 

conda env list
```

### conda数据迁移
最常用的方法，现在A服务器导出，再向B服务器导入。这里可以使用scp的相关方法。
```bash
# 导出
conda activate your_env_name  # 激活需要导出的环境
conda env export > environment.yml  # 导出环境到文件
conda env export --no-builds > transformer.yml

# 导入
conda env create -f transformer.yml
```

## git
### 新服务器设置git
下载git
```bash
apt install git -y
```

配置邮箱账户  
### 本地已有代码，从头创建仓库
远程先创建一个空的仓库, 不用加README文件
本地
```bash
git remote add origin git@github.com:wadou42/SRTuner.git

git add .
git commit -m "init"
git push -u origin master
```

### 网络代理
设置代理、取消代理
```bash
git config --global https.proxy http://172.19.135.130:5000
git config --global http.proxy http://172.19.135.130:5000

git config --global --unset http.proxy
git config --global --unset https.proxy

git remote set-url origin git@github.com:wadou42/Autotunning.git
git remote set-url origin git@github.com:wadou42/Autotunning.git
```

### 添加ssh
```bash
ssh-keygen -t rsa -C "508745774@qq.com"
cat .ssh/id_rsa.pub
```
### 创建分支
从`master`分支创建新的`dev-123`分支
```bash
git fetch
git checkout master           # 切换到基准分支
git pull origin master        # 确保本地 master 分支最新
git checkout -b dev  # 创建新分支(这里默认以当前分支创建，也可以加上master)
# git checkout -b dev master
git push -u origin dev # 推送新分支到远程
```
### 从远程同步分支
将刚创建的分支push到远程仓库之后，在一台新的服务器上如何获取这个分支呢：
```bash
git checkout -b refactor origin/refactor

# 如果是一个新的服务器，可以这样同步所有的分支
for branch in $(git branch -r | grep -v 'HEAD'); do git checkout --track "$branch"; done
```
## tldr
too long doesn't read
```bash
sudo yum install tldr
tldr --update
tldr xx
alais how=tldr
```


## Linux 常用命令

###  压缩常用的命令

```bash
# 压缩/解压文件常用的方法
zip -r mydata.zip /home/user1/mydata/
unzip mydata.zip

tar -zcvf test.tar.gz file1 dir2
tar -zxvf test.tar.gz
```

### 文件管理

```
ln
ln [-s] <file> <new_link_file> # 第一个参数是原文件，后面的是连接产生的新文件
```

chown/chmod

```bash
# 将文件的所有者更改为user
chown <user> <file>
chown <user:group> <file>
# 更改文件的权限，数字版和字母版
chmod 755 <file>  # 4：r；2：w；1：x
chmod u+x <file>  # 对文件增加执行的权限
chmod u+r <file>  # 对所有者增加可读权限
# u,g,o,a 分别是user,group,other,all(default)
# + - = 分别是增加、减少、设置
```

关于chmod常见的配置

- 可执行文件：755
- 共享可执行文件：775
- 普通文件：644
- 私密文件：600

### 重定向

```bash
# 标准输入重定向
wc -l < input.txt
# 管道，这样可以将多个命令串在一起
ls -l | grep "txt"
# stdout不需要表明1，但是stderr需要额外的表明是2
command > output.log 2> error.log
command > output.log 2>&1 # 将标准错误也输入到相同的位置
command > /dev/null 2>&1 
```

### cat
```bash
cat filename
cat filename > a.txt
cat a.txt b.txt > combine.txt

# less 的功能更多一些
cat filename | more
cat filename | less
```

### tail/head
```bash
tail file.txt          # 显示最后 10 行
tail -n 5 file.txt     # 显示最后 5 行
tail -f logfile.log    # 实时显示
```

### alias
```bash
alias 别名=command
unalias 别名
```

## 跨系统文件传输
中转传输，最常用的方式。由a传输到b
```bash

scp -3 user@server_a:/path/to/file user@server_b:/path/to/remote/directory
# example
scp -3 -r whq@173.52.1.2:/home/whq/CodeRep wanghongqi@172.31.128.205:/home/wanghongqi

scp -3 -r wanghongqi@172.31.128.205:/home/wanghongqi/CodeRep/models/modify_saved_combined_model_best.pth whq@173.52.1.2:/home/whq
```
直接向某一个服务器传输
```bash
scp F:\EdgeDonload\cmake-3.23.1-linux-aarch64.tar.gz whq@173.52.1.2:/home/whq/Download
```
## tmux
### 会话删除与创建
```bash
tmux new-session -s whq  #这里s是session的意思
```

## 服务器网络问题
**前提：本机可以使用clash连接外网**
### 局域网中
clash中：常规 --> 允许局域网连接入Clash
服务器：
```bash
export hostip=172.23.129.60
export socks_hostport=7890    #clash默认为7890
export http_hostport=7890

alias proxyon='
    export https_proxy="http://${hostip}:${http_hostport}"
    export http_proxy="http://${hostip}:${http_hostport}"
    export ALL_PROXY="socks5://${hostip}:${socks_hostport}"
    export all_proxy="socks5://${hostip}:${socks_hostport}"   
   '
alias proxyoff='
    unset ALL_PROXY
    unset https_proxy
    unset http_proxy
    unset all_proxy
   '
alias proxyecho='
    echo $ALL_PROXY
    echo $all_proxy
    echo $https_proxy
    echo $http_proxy
'
```

如果不是局域网，不适合上述方法

### 广域网
使用远程端口转发
本地：
```bash
ssh -R <remote_port>:<local_address>:<local_port>

# example
ssh -R 7890:localhost:7890 whq@173.52.1.2
```
远程：
```bash
ssh -R 7892:localhost:7892 whq@173.52.1.2
export http_proxy=http://127.0.0.1:7892
export https_proxy=http://127.0.0.1:7892
```

**注意： 在关闭的时候不可以直接 X ssh窗口，否则会导致自己电脑的clash不可用。** 使用下面的方法退出：
* ctrl + D
* 终端输入 exit
