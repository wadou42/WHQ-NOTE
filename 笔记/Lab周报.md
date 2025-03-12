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


### 模型介绍：
我们先建立一个能够预测一个函数在不同优化配置下的执行时间的预测模型。下文中称函数为code、优化配置成为opt。

目前的工作： 我们使用的是一个组合模型，组合模型分为三个部分：代码表征模型、优化表征模型、预测模型。 code进入代码表征模型，opt进入优化表征模型，二者的表征出来直接contact

```
训练入口： Autotunning/main.py
训练类： Autotunning/train.py
数据预处理： Autotunning/utils/preprocess.py 
模型： Autotunning/models
配置文件： config/config.yaml
```