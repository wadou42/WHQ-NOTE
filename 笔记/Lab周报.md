## 2025年3月3日
### DONE
1. 降低数据集的筛选阈值、以code为粒度交叉验证：阈值降低为50ms，按照8:1:1比例划分train/val/test。其中，保证code不交叉，即不同集合中不包含相同的code。
2. 数据加强，由于我们的Label——加速比的范围是[0,+inf ]，集中在1附近，并且小于1的值比较稠密，因此对Label取对数，使数据分布更加的均匀一些。
3. 调整预测模型的层数、参数等等...
CodeT5
code 800 数据2.4w
最后结果和下面的大同小异，val-loss一直不下降
![[loss_curve.png]]
### TODO
MSELoss
再尝试换表征模型，然后同时收集数据吧...
试一下二分类
**mlp参数量不够**   
表征模型： 结构上的表征(graph-codebert)

##  2025年3月12日


### 模型介绍
我们希望训练一个能够预测一个函数在不同优化配置下的执行时间相对于在-O3优化配置下的加速比的预测模型。下文中称函数为code、优化配置成为opt，加速比为speedup。

### 目前的工作
我们使用的是一个组合模型，组合模型分为三个部分：代码表征模型、优化表征模型、预测模型。 code进入代码表征模型，opt进入优化表征模型，二者的表征出来直接contact作为输入，进入预测模型做回归问题（speedup是多少）或者做二分类任务（opt是否有加速效果）

### 数据集
feature：函数（code）、优化配置(config)  
label：相对于O3的加速比(spreedup)

数据集的收集方式：
使用opt1 编译某个程序，然后统计各个函数的执行时间，得到若干条instace  ( opt1-code1-speedup1, opt1-code2-speedup2, opt1-code3-speedup3......)
然后使用opt2 进行编译程序，统计.......

数据集的分布：
	原始数据过分集中在1附近，并且小1的密度大于 大于1 的值，不利于做预测任务
![[数据集原始数据分布.png]]
	
在做预测任务的时候，采用取对数的方法：
![[数据集log时间分布.png]]
	在做分类任务的时候，对`1±threshold`的值剔除、有时为了数据的平衡性，对[1-threshold, 1+threshold/2]的数据进行剔除，原始数据正负样本比例大概为3:7；按照有偏剔除，正负样本的比例大概为4:5，基本平衡。

```
训练入口： Autotunning/main.py
训练类： Autotunning/train.py
数据预处理： Autotunning/utils/preprocess.py 
模型： Autotunning/models
配置文件： config/config.yaml
```