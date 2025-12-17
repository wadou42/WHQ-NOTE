| 软件\方法  | benchmark       | 参数设置                |
| ------ | --------------- | ------------------- |
| redis  | redis-benchmark | 5000w get,set       |
| doris  | tpch            |                     |
| scann  | ann-benchmark   |                     |
| zstd?  |                 |                     |
| mysql? | sysbench        | 64 * 100w, readonly |

| 软件\方法  | Our | O3                       | SRTuner   | ir2vec |
| ------ | --- | ------------------------ | --------- | ------ |
| redis  |     |                          |           |        |
| doris  |     |                          |           |        |
| scann  |     |                          |           |        |
| zstd?  |     |                          |           |        |
| mysql? |     | 11578.53(PGO :14093.52 ) | 约11578.53 |        |
|        |     |                          |           |        |
