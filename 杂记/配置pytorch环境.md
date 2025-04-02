1. 安装conda
2. 配置清华源
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

   3. 配置环境
```bash
conda create -n pytorch python=3.9 # 这里的pytorch是名字，环境名字
conda activate pytorch

conda install pytorch torchvision torchaudio cpuonly -c pytorch
```

4. 常用操作
```bash
conda activate env_name
conda deactivate # 退出环境

conda env list  # 查看环境
conda remove -n env_name --all # 删除环境
```