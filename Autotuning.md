| 软件\方法  | benchmark       | 参数设置                |
| ------ | --------------- | ------------------- |
| redis  | redis-benchmark | 5000w get,set       |
| doris  | tpch            |                     |
| scann  | ann-benchmark   |                     |
| zstd?  |                 |                     |
| mysql? | sysbench        | 64 * 100w, readonly |
|        |                 |                     |

| 软件\方法  | Our | O3                       | SRTuner   | ir2vec |
| ------ | --- | ------------------------ | --------- | ------ |
| redis  |     |                          |           |        |
| doris  |     |                          |           |        |
| scann  |     |                          |           |        |
| zstd?  |     |                          |           |        |
| mysql? |     | 11578.53(PGO :14093.52 ) | 约11578.53 |        |
|        |     |                          |           |        |

















| 软件\方法  | benchmark       | 参数设置                |
| ------ | --------------- | ------------------- |
| redis  | redis-benchmark | 5000w get,set       |
| doris  | tpch            | 10GB data           |
| scann  | ann-benchmark   |                     |
| zstd?  | test.json       |                     |
| mysql? | sysbench        | 64 * 100w, readonly |

|               软件\方法                |            Our             |              O3              |             SRTuner              |        ir2vec        |
| :--------------------------------: | :------------------------: | :--------------------------: | :------------------------------: | :------------------: |
|               redis                | 2663857.25<br>（16.81%, 32） |        2280410.25 qps        |    2,367,106.25<br>（3.8%, 50）    |          重测          |
|               doris                |   2099.0<br>(15.15%, 39)   |          2417.0 ms           | 2687.0<br>（-5.03% , 42）<br>需要重测？ |         重测？          |
|               scann                |  500.4221<br>(9.26%, 19)   |         457.5862 qps         |      461.77<br>（0.91%, 11)       | 452.09<br>（1.20%,23） |
|               zstd?                |           2.4% ?           |                              |                ?                 |                      |
|               mysql?               |                            | 11578.53<br>(PGO :14093.52 ) |       约11578.53<br>(0 %, )       |                      |
|             Total Acc              |           41.22%           |                              |                                  |                      |
| Total Acc <br>For other<br> method |            <br>            |                              |                                  |                      |
