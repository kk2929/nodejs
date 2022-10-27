using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : Token
{
    // Start is called before the first frame update
    void Start()
    {
        // ランダムな方向に移動する
        // 方向をランダムに決める
        float dir = Random.Range(0, 359);
        // 速さは2
        float spd = 2;
        SetVelocity(dir, spd);
    }

    // Update is called once per frame
    void Update()
    {

    }
}
