import React from 'react';
import ReactECharts from 'echarts-for-react';

const ReactEchart = () => {
    const option = {
        // title: {
        //     text: 'ECharts 入门示例'
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            data: ['القاهرة', 'الاسكندرية', 'الجيزة', 'المنصورة', 'اسوان', 'المنيا']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: [10, 52, 20, 34, 90, 33, 81]
            }
        ]
    };

    return <ReactECharts
        option={option}
        style={{ height: 300 }}
        opts={{ renderer: 'svg' }}
    />;
};

export default ReactEchart;