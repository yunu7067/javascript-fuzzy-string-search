# Levenshtein
# Algorithm
$$lev(a,b) = {
    \begin{cases} 
        |a| & \text{if } |b| = 0, \\ 
        |b| & \text{if } |a| = 0,\\ 
        lev(tail(a), tail(b)) & \text{if }a[0] = b[0] \\ 

        1 + min \begin{cases}
                    lev(tail(a), b) \\
                    lev(a, tail(b))  \\ 
                    lev(tail(a), tail(b)) \\ 
                \end{cases} & \text{otherwise.}
    \end{cases} 
}$$

1. if r != c일 경우:
    이전 값들 + 1을 해서 최솟값을 구하여 기입한다
    |   |   |
    |---|---|
    | Replace  | Remove  |
    | Insert  |  min(Replace, Remove, Insert)   |

2. if r == c 일 경우:
    대각선 방향의 값을 그대로 기입한다
    |   |   |
    |---|---|
    | n  |   |
    |   |   n  |

