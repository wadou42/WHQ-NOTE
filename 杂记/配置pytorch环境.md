**1-3  是在command line中操作，已经帮你做完了**

1. 安装conda，不要安装在c盘（你的电脑已经安装好了）
2. 配置清华源（已经配置过了）
	1. 查看已有的镜像
	```bash
	conda config --show channels
	```
	2. 如果没有下面的镜像添加镜像
```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/

conda config --set show_channel_urls yes
```

   3. 配置环境（已经创建过了）
```bash
# 创建新环境
conda create -n cpupytorch python=3.9 # 这里的cpupytorch是名字，环境名字
# 激活环境
conda activate cpupytorch
# conda install 和 pip install都可以，conda install可以自己尝试解决冲突，pip更快
conda install pytorch torchvision torchaudio cpuonly -c pytorch
```

后续使用
![[Pasted image 20250402112619.png]]
在右上角选择解释器，现在用这个cpupytorch就可以

如果有其他需要的包
```bash
! pip install xxx
```