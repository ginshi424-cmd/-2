
import React from 'react';
import { Standing } from '../types';

interface StandingsProps {
  title: string;
  data: Standing[];
  type: 'driver' | 'team';
}

const Standings: React.FC<StandingsProps> = ({ title, data, type }) => {
  return (
    <div className="mb-12">
      <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full max-w-4xl mx-auto text-sm bg-white shadow-sm">
          <thead>
            <tr className="bg-[#D91610] text-white uppercase text-xs font-bold tracking-wider">
              <th className="py-2 px-4 text-left w-12"></th>
              <th className="py-2 px-4 text-left">{type === 'driver' ? 'Driver' : 'Team'}</th>
              {type === 'driver' && <th className="py-2 px-4 text-left">Team</th>}
              <th className="py-2 px-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-4 text-gray-800 font-bold">{item.position}</td>
                <td className="py-2 px-4 font-medium text-gray-900">{item.name}</td>
                {type === 'driver' && <td className="py-2 px-4 text-gray-600">{item.team}</td>}
                <td className="py-2 px-4 text-right font-bold text-gray-900">{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standings;
