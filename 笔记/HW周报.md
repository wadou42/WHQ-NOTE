### 工作进展
1. 在上次讨论时，使用codebert表征，MLP做预测，效果非常差。

2. 过去使用了（codebert/CodeT5/GraphCodeBert）X（MLP、ResNet）组合做预测，发现效果并不理想，以及一些其他的尝试...

3. 数据集分布存在问题。目前的数据集由code和opt的笛卡尔积。如果按照code进行分组统计。
	横轴是codeGroup
	图例分别是：红色：均值； 绿色、橙色、蓝色分别对应四分位数
![[加速比数据分布——按照code划分.png]] 不同的code因为在O3的情况下已经效果“比较好了”，或者说被内联等操作导致执行时间非常短，导致加速比较非常小，并且方差也较小。同理一些code因为内联其他函数，执行时间很长，也会导致speedup很大。 

**DOING**  将这些“两端”的数据筛除，进行训练
code在val和train上是不交叉，但opt交叉的情况下进行训练
#### 在分类任务上：
Test1：Accuracy: 0.7593, Precision: 0.8737, Recall: 0.6990, F1_score: 0.7766, Positive_ratio（验证集中正类占比）: 0.5988
Test2：  Accuracy: 0.7222, Precision: 0.7463, Recall: 0.6550, F1_score: 0.6977, Positive_ratio: 0.4893
整体来说，对于已经见过的opt来讲，预测的precision还是比较高的，但是recall比较低。对于unseen的opt+code表现差

#### 在回归任务上：
Train Loss:         1.9435,   Mse: 17.3165,    Mae: 2.3763,     R2: 0.4048
Validation Loss: 2.3108,   Mse: 18.2505,    Mae: 2.7653,     R2: 0.1147

在回归任务上表现并不好，但是这里的R2不再是0,（在之前的版本中，只要code是未见过的R2是一个0附近的数），并且经过验证这并不是由数据集分布造成的。


### 下一步计划
