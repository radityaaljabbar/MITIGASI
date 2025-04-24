import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PsychologyChart({ data }) {
  if (!data) return null;
  
  return (
    <div className="p-6 rounded-lg mb-6 border-2 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Profil Psikologi</h3>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="nilai" fill="#9f1239" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}