import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { FunctionComponent } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineGraph: FunctionComponent<{data: any}> = ({data}) => {
  const options: any = {
    scales: {
      y:
        {
          min: 0,
          max: 6,
          stepSize: 1,
        }
    },
  };

  return (
      <Line data={data} options={options}/>
  )
}