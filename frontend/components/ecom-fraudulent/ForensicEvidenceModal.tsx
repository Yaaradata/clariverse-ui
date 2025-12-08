'use client';

import { useState } from 'react';
import { 
  X, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Twitter,
  Mail,
  Ticket,
  AlertTriangle,
  Shield,
  User,
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

// ============ CASES DATA ============
interface ForensicCase {
  id: string;
  caseId: string;
  riskScore: number;
  customerName: string;
  customerPhone: string;
  value: number;
  status: 'Open' | 'Under Review' | 'Escalated' | 'Resolved';
  channel: 'Chat' | 'Email' | 'Voice Transcript' | 'Ticket' | 'Trustpilot' | 'X (Twitter)' | 'Reddit' | 'App Store' | 'Play Store';
  courierPartner: string;
  gpsDrift: number;
  timestamp: string;
}

// Pattern-specific case data
const patternCases: Record<string, ForensicCase[]> = {
  // FI-001: Delivery Liability Risk (Fulfillment Fraud)
  'FI-001': [
    { id: 'FC-001', caseId: 'TKT-78234', riskScore: 94, customerName: 'Rahul Sharma', customerPhone: '98XX-XXX-234', value: 89999, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 2.4, timestamp: '2h ago' },
    { id: 'FC-002', caseId: 'TKT-78451', riskScore: 91, customerName: 'Suresh Kumar', customerPhone: '91XX-XXX-567', value: 125000, status: 'Open', channel: 'Voice Transcript', courierPartner: 'FastDispatch', gpsDrift: 3.2, timestamp: '1h ago' },
    { id: 'FC-003', caseId: 'TKT-78189', riskScore: 87, customerName: 'Meera Patel', customerPhone: '88XX-XXX-123', value: 67999, status: 'Under Review', channel: 'Ticket', courierPartner: 'E-Kart', gpsDrift: 1.9, timestamp: '3h ago' },
    { id: 'FC-004', caseId: 'TKT-78012', riskScore: 89, customerName: 'Vikram Reddy', customerPhone: '97XX-XXX-456', value: 145000, status: 'Escalated', channel: 'Email', courierPartner: 'BlueDart', gpsDrift: 2.8, timestamp: '45m ago' },
    { id: 'FC-005', caseId: 'TKT-77945', riskScore: 85, customerName: 'Priya Nair', customerPhone: '96XX-XXX-789', value: 98000, status: 'Open', channel: 'Chat', courierPartner: 'Delhivery', gpsDrift: 2.1, timestamp: '2h ago' },
    { id: 'FC-006', caseId: 'TKT-77878', riskScore: 88, customerName: 'Amit Desai', customerPhone: '95XX-XXX-321', value: 112000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'FastDispatch', gpsDrift: 3.5, timestamp: '1h ago' },
    { id: 'FC-007', caseId: 'TKT-77711', riskScore: 83, customerName: 'Kavita Menon', customerPhone: '94XX-XXX-654', value: 76000, status: 'Under Review', channel: 'Ticket', courierPartner: 'E-Kart', gpsDrift: 1.6, timestamp: '4h ago' },
    { id: 'FC-008', caseId: 'TKT-77644', riskScore: 90, customerName: 'Rajesh Iyer', customerPhone: '93XX-XXX-987', value: 134000, status: 'Open', channel: 'Email', courierPartner: 'BlueDart', gpsDrift: 2.9, timestamp: '30m ago' },
    { id: 'FC-009', caseId: 'TKT-77577', riskScore: 86, customerName: 'Sneha Joshi', customerPhone: '92XX-XXX-147', value: 89000, status: 'Under Review', channel: 'Chat', courierPartner: 'Delhivery', gpsDrift: 2.3, timestamp: '3h ago' },
    { id: 'FC-010', caseId: 'TKT-77410', riskScore: 92, customerName: 'Karan Malhotra', customerPhone: '91XX-XXX-258', value: 156000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'FastDispatch', gpsDrift: 3.8, timestamp: '15m ago' },
    { id: 'FC-011', caseId: 'TKT-77343', riskScore: 84, customerName: 'Anita Rao', customerPhone: '90XX-XXX-369', value: 72000, status: 'Open', channel: 'Ticket', courierPartner: 'E-Kart', gpsDrift: 1.8, timestamp: '5h ago' },
    { id: 'FC-012', caseId: 'TKT-77276', riskScore: 87, customerName: 'Mohan Singh', customerPhone: '89XX-XXX-741', value: 103000, status: 'Under Review', channel: 'Email', courierPartner: 'BlueDart', gpsDrift: 2.6, timestamp: '2h ago' },
    { id: 'FC-013', caseId: 'TKT-77109', riskScore: 91, customerName: 'Deepa Krishnan', customerPhone: '88XX-XXX-852', value: 128000, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 3.1, timestamp: '1h ago' },
    { id: 'FC-014', caseId: 'TKT-77042', riskScore: 85, customerName: 'Nitin Agarwal', customerPhone: '87XX-XXX-963', value: 95000, status: 'Open', channel: 'Voice Transcript', courierPartner: 'Delhivery', gpsDrift: 2.0, timestamp: '4h ago' },
    { id: 'FC-015', caseId: 'TKT-76975', riskScore: 88, customerName: 'Lakshmi Venkatesh', customerPhone: '86XX-XXX-159', value: 118000, status: 'Under Review', channel: 'Ticket', courierPartner: 'E-Kart', gpsDrift: 2.7, timestamp: '3h ago' },
  ],
  
  // FI-002: Internal Policy Violations (Insider Collusion)
  'FI-002': [
    { id: 'FC-016', caseId: 'TKT-77998', riskScore: 96, customerName: 'Vikram Thapar', customerPhone: '70XX-XXX-567', value: 145000, status: 'Escalated', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '45m ago' },
    { id: 'FC-017', caseId: 'TKT-77892', riskScore: 89, customerName: 'Anita Desai', customerPhone: '85XX-XXX-234', value: 98000, status: 'Open', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-018', caseId: 'TKT-77678', riskScore: 85, customerName: 'Rajesh Mehta', customerPhone: '99XX-XXX-890', value: 67000, status: 'Under Review', channel: 'Ticket', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-019', caseId: 'TKT-76808', riskScore: 94, customerName: 'Suresh Nair', customerPhone: '84XX-XXX-123', value: 178000, status: 'Escalated', channel: 'Email', courierPartner: 'N/A', gpsDrift: 0, timestamp: '30m ago' },
    { id: 'FC-020', caseId: 'TKT-76741', riskScore: 87, customerName: 'Meera Kapoor', customerPhone: '83XX-XXX-456', value: 92000, status: 'Open', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-021', caseId: 'TKT-76674', riskScore: 91, customerName: 'Amit Verma', customerPhone: '82XX-XXX-789', value: 156000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '20m ago' },
    { id: 'FC-022', caseId: 'TKT-76507', riskScore: 83, customerName: 'Priya Shah', customerPhone: '81XX-XXX-321', value: 78000, status: 'Under Review', channel: 'Ticket', courierPartner: 'N/A', gpsDrift: 0, timestamp: '3h ago' },
    { id: 'FC-023', caseId: 'TKT-76440', riskScore: 88, customerName: 'Karan Bhatia', customerPhone: '80XX-XXX-654', value: 134000, status: 'Open', channel: 'Email', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-024', caseId: 'TKT-76373', riskScore: 86, customerName: 'Kavita Reddy', customerPhone: '79XX-XXX-987', value: 101000, status: 'Under Review', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '4h ago' },
    { id: 'FC-025', caseId: 'TKT-76310', riskScore: 90, customerName: 'Rohan Deshmukh', customerPhone: '78XX-XXX-147', value: 142000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '55m ago' },
  ],
  
  // FI-003: Non-Resalable Returns (Asset Abuse)
  'FI-003': [
    { id: 'FC-031', caseId: 'TKT-77512', riskScore: 82, customerName: 'Priya Menon', customerPhone: '77XX-XXX-891', value: 12999, status: 'Open', channel: 'Chat', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-032', caseId: 'TKT-77456', riskScore: 78, customerName: 'Kavita Nair', customerPhone: '92XX-XXX-456', value: 18999, status: 'Under Review', channel: 'Voice Transcript', courierPartner: 'Delhivery', gpsDrift: 0, timestamp: '4h ago' },
    { id: 'FC-033', caseId: 'TKT-77321', riskScore: 75, customerName: 'Amit Kumar', customerPhone: '91XX-XXX-789', value: 8999, status: 'Open', channel: 'Ticket', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '5h ago' },
    { id: 'FC-034', caseId: 'TKT-75704', riskScore: 80, customerName: 'Rohit Sharma', customerPhone: '72XX-XXX-159', value: 14999, status: 'Open', channel: 'Email', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '3h ago' },
    { id: 'FC-035', caseId: 'TKT-75637', riskScore: 77, customerName: 'Sunita Devi', customerPhone: '71XX-XXX-258', value: 16999, status: 'Under Review', channel: 'Chat', courierPartner: 'Delhivery', gpsDrift: 0, timestamp: '6h ago' },
    { id: 'FC-036', caseId: 'TKT-75570', riskScore: 83, customerName: 'Manish Gupta', customerPhone: '70XX-XXX-369', value: 21999, status: 'Open', channel: 'Voice Transcript', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-037', caseId: 'TKT-75403', riskScore: 79, customerName: 'Pooja Singh', customerPhone: '69XX-XXX-741', value: 11999, status: 'Under Review', channel: 'Ticket', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '4h ago' },
    { id: 'FC-038', caseId: 'TKT-75336', riskScore: 76, customerName: 'Vishal Mehta', customerPhone: '68XX-XXX-852', value: 9999, status: 'Open', channel: 'Email', courierPartner: 'Delhivery', gpsDrift: 0, timestamp: '7h ago' },
    { id: 'FC-039', caseId: 'TKT-75269', riskScore: 81, customerName: 'Anjali Patel', customerPhone: '67XX-XXX-963', value: 24999, status: 'Open', channel: 'Chat', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-040', caseId: 'TKT-75102', riskScore: 84, customerName: 'Ravi Kumar', customerPhone: '66XX-XXX-147', value: 18999, status: 'Under Review', channel: 'Voice Transcript', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '5h ago' },
    { id: 'FC-041', caseId: 'TKT-75035', riskScore: 78, customerName: 'Sonia Reddy', customerPhone: '65XX-XXX-258', value: 13999, status: 'Open', channel: 'Ticket', courierPartner: 'Delhivery', gpsDrift: 0, timestamp: '8h ago' },
    { id: 'FC-042', caseId: 'TKT-74968', riskScore: 82, customerName: 'Aditya Joshi', customerPhone: '64XX-XXX-369', value: 19999, status: 'Under Review', channel: 'Email', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '3h ago' },
    { id: 'FC-043', caseId: 'TKT-74801', riskScore: 80, customerName: 'Nisha Iyer', customerPhone: '63XX-XXX-741', value: 15999, status: 'Open', channel: 'Chat', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '6h ago' },
    { id: 'FC-044', caseId: 'TKT-74790', riskScore: 79, customerName: 'Gaurav Malhotra', customerPhone: '62XX-XXX-852', value: 10999, status: 'Under Review', channel: 'Voice Transcript', courierPartner: 'Delhivery', gpsDrift: 0, timestamp: '9h ago' },
  ],
  
  // FI-004: Marketing Budget Waste (Incentive Fraud)
  'FI-004': [
    { id: 'FC-046', caseId: 'TKT-77234', riskScore: 93, customerName: 'Rahul Agarwal', customerPhone: '90XX-XXX-999', value: 45000, status: 'Escalated', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '30m ago' },
    { id: 'FC-047', caseId: 'TKT-77189', riskScore: 88, customerName: 'Priyanka Sharma', customerPhone: '89XX-XXX-888', value: 32000, status: 'Open', channel: 'Reddit', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-048', caseId: 'TKT-77045', riskScore: 84, customerName: 'Vikram Singh', customerPhone: '87XX-XXX-777', value: 28000, status: 'Under Review', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-049', caseId: 'TKT-74600', riskScore: 91, customerName: 'Anjali Reddy', customerPhone: '60XX-XXX-159', value: 52000, status: 'Escalated', channel: 'X (Twitter)', courierPartner: 'N/A', gpsDrift: 0, timestamp: '20m ago' },
    { id: 'FC-050', caseId: 'TKT-74533', riskScore: 86, customerName: 'Suresh Nair', customerPhone: '59XX-XXX-258', value: 38000, status: 'Open', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-051', caseId: 'TKT-74466', riskScore: 89, customerName: 'Meera Iyer', customerPhone: '58XX-XXX-369', value: 48000, status: 'Escalated', channel: 'Reddit', courierPartner: 'N/A', gpsDrift: 0, timestamp: '45m ago' },
    { id: 'FC-052', caseId: 'TKT-74399', riskScore: 85, customerName: 'Amit Kumar', customerPhone: '57XX-XXX-741', value: 35000, status: 'Open', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-053', caseId: 'TKT-74332', riskScore: 87, customerName: 'Kavita Patel', customerPhone: '56XX-XXX-852', value: 42000, status: 'Under Review', channel: 'X (Twitter)', courierPartner: 'N/A', gpsDrift: 0, timestamp: '3h ago' },
  ],
  
  // FI-005: Organized Fraud Rings (Syndicated Claims)
  'FI-005': [
    { id: 'FC-061', caseId: 'TKT-76987', riskScore: 97, customerName: 'Ramesh Kumar', customerPhone: '86XX-XXX-666', value: 156000, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '15m ago' },
    { id: 'FC-062', caseId: 'TKT-76854', riskScore: 94, customerName: 'Lakshmi Devi', customerPhone: '85XX-XXX-555', value: 189000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '45m ago' },
    { id: 'FC-063', caseId: 'TKT-76721', riskScore: 91, customerName: 'Suresh Reddy', customerPhone: '84XX-XXX-444', value: 134000, status: 'Open', channel: 'Ticket', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-064', caseId: 'TKT-73796', riskScore: 96, customerName: 'Kamala Iyer', customerPhone: '48XX-XXX-159', value: 178000, status: 'Escalated', channel: 'Email', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '10m ago' },
    { id: 'FC-065', caseId: 'TKT-73729', riskScore: 93, customerName: 'Venkatesh Naidu', customerPhone: '47XX-XXX-258', value: 165000, status: 'Escalated', channel: 'Chat', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '35m ago' },
    { id: 'FC-066', caseId: 'TKT-73662', riskScore: 95, customerName: 'Sarojini Menon', customerPhone: '46XX-XXX-369', value: 192000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '20m ago' },
    { id: 'FC-067', caseId: 'TKT-73595', riskScore: 90, customerName: 'Gopalakrishnan Nair', customerPhone: '45XX-XXX-741', value: 142000, status: 'Open', channel: 'Ticket', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '1h ago' },
  ],
  
  // FI-006: Reputation Ransom Attacks (Brand Extortion)
  'FI-006': [
    { id: 'FC-076', caseId: 'TKT-76678', riskScore: 89, customerName: 'Karan Patel', customerPhone: '83XX-XXX-333', value: 34500, status: 'Escalated', channel: 'X (Twitter)', courierPartner: 'N/A', gpsDrift: 0, timestamp: '25m ago' },
    { id: 'FC-077', caseId: 'TKT-76543', riskScore: 86, customerName: 'Priyanka Shah', customerPhone: '82XX-XXX-222', value: 28900, status: 'Open', channel: 'Trustpilot', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-078', caseId: 'TKT-76410', riskScore: 83, customerName: 'Rohit Agarwal', customerPhone: '81XX-XXX-111', value: 22500, status: 'Under Review', channel: 'Reddit', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-079', caseId: 'TKT-72992', riskScore: 91, customerName: 'Anjali Desai', customerPhone: '36XX-XXX-159', value: 42000, status: 'Escalated', channel: 'X (Twitter)', courierPartner: 'N/A', gpsDrift: 0, timestamp: '15m ago' },
    { id: 'FC-080', caseId: 'TKT-72925', riskScore: 88, customerName: 'Vikram Nair', customerPhone: '35XX-XXX-258', value: 38000, status: 'Open', channel: 'App Store', courierPartner: 'N/A', gpsDrift: 0, timestamp: '45m ago' },
    { id: 'FC-081', caseId: 'TKT-72858', riskScore: 85, customerName: 'Meera Iyer', customerPhone: '34XX-XXX-369', value: 32000, status: 'Under Review', channel: 'Play Store', courierPartner: 'N/A', gpsDrift: 0, timestamp: '3h ago' },
    { id: 'FC-082', caseId: 'TKT-72791', riskScore: 90, customerName: 'Suresh Reddy', customerPhone: '33XX-XXX-741', value: 45000, status: 'Escalated', channel: 'Trustpilot', courierPartner: 'N/A', gpsDrift: 0, timestamp: '30m ago' },
    { id: 'FC-083', caseId: 'TKT-72724', riskScore: 87, customerName: 'Kavita Menon', customerPhone: '32XX-XXX-852', value: 36000, status: 'Open', channel: 'X (Twitter)', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-084', caseId: 'TKT-72657', riskScore: 84, customerName: 'Amit Joshi', customerPhone: '31XX-XXX-963', value: 28000, status: 'Under Review', channel: 'Reddit', courierPartner: 'N/A', gpsDrift: 0, timestamp: '4h ago' },
    { id: 'FC-085', caseId: 'TKT-72590', riskScore: 92, customerName: 'Divya Rao', customerPhone: '30XX-XXX-147', value: 48000, status: 'Escalated', channel: 'App Store', courierPartner: 'N/A', gpsDrift: 0, timestamp: '20m ago' },
    { id: 'FC-086', caseId: 'TKT-72523', riskScore: 86, customerName: 'Rajesh Malhotra', customerPhone: '29XX-XXX-258', value: 31000, status: 'Open', channel: 'Play Store', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
  ],
  
  // FI-007: RaaS Signals (3rd Party Fraud)
  'FI-007': [
    { id: 'FC-091', caseId: 'TKT-76367', riskScore: 95, customerName: 'Ramesh Patel', customerPhone: '80XX-XXX-000', value: 78000, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '10m ago' },
    { id: 'FC-092', caseId: 'TKT-76234', riskScore: 92, customerName: 'Sunita Kumar', customerPhone: '79XX-XXX-999', value: 65000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '35m ago' },
    { id: 'FC-093', caseId: 'TKT-76101', riskScore: 88, customerName: 'Mohan Reddy', customerPhone: '78XX-XXX-888', value: 52000, status: 'Open', channel: 'Reddit', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-094', caseId: 'TKT-72188', riskScore: 96, customerName: 'Lakshmi Nair', customerPhone: '24XX-XXX-159', value: 89000, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '5m ago' },
    { id: 'FC-095', caseId: 'TKT-72121', riskScore: 93, customerName: 'Venkatesh Iyer', customerPhone: '23XX-XXX-258', value: 72000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '25m ago' },
    { id: 'FC-096', caseId: 'TKT-72054', riskScore: 90, customerName: 'Kamala Menon', customerPhone: '22XX-XXX-369', value: 68000, status: 'Open', channel: 'X (Twitter)', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-097', caseId: 'TKT-71987', riskScore: 94, customerName: 'Gopalakrishnan Rao', customerPhone: '21XX-XXX-741', value: 85000, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '15m ago' },
    { id: 'FC-098', caseId: 'TKT-71920', riskScore: 91, customerName: 'Sarojini Pillai', customerPhone: '20XX-XXX-852', value: 71000, status: 'Open', channel: 'Voice Transcript', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '50m ago' },
    { id: 'FC-099', caseId: 'TKT-71853', riskScore: 89, customerName: 'Balakrishnan Nambiar', customerPhone: '19XX-XXX-963', value: 64000, status: 'Under Review', channel: 'Reddit', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-100', caseId: 'TKT-71786', riskScore: 97, customerName: 'Indira Subramanian', customerPhone: '18XX-XXX-147', value: 95000, status: 'Escalated', channel: 'Chat', courierPartner: 'FastDispatch', gpsDrift: 0, timestamp: '8m ago' },
    { id: 'FC-101', caseId: 'TKT-71719', riskScore: 92, customerName: 'Srinivasan Krishnan', customerPhone: '17XX-XXX-258', value: 76000, status: 'Escalated', channel: 'Voice Transcript', courierPartner: 'BlueDart', gpsDrift: 0, timestamp: '30m ago' },
    { id: 'FC-102', caseId: 'TKT-71652', riskScore: 88, customerName: 'Vasantha Kumari', customerPhone: '16XX-XXX-369', value: 59000, status: 'Open', channel: 'X (Twitter)', courierPartner: 'E-Kart', gpsDrift: 0, timestamp: '3h ago' },
  ],
  
  // FI-008: Cross-Channel Arbitration (Policy Arbitrage)
  'FI-008': [
    { id: 'FC-106', caseId: 'TKT-76068', riskScore: 87, customerName: 'Meera Singh', customerPhone: '77XX-XXX-777', value: 22500, status: 'Open', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-107', caseId: 'TKT-75935', riskScore: 84, customerName: 'Arjun Deshmukh', customerPhone: '76XX-XXX-666', value: 18900, status: 'Under Review', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-108', caseId: 'TKT-75802', riskScore: 81, customerName: 'Neha Kapoor', customerPhone: '75XX-XXX-555', value: 15600, status: 'Open', channel: 'Email', courierPartner: 'N/A', gpsDrift: 0, timestamp: '3h ago' },
    { id: 'FC-109', caseId: 'TKT-71384', riskScore: 89, customerName: 'Siddharth Agarwal', customerPhone: '12XX-XXX-159', value: 28900, status: 'Open', channel: 'Ticket', courierPartner: 'N/A', gpsDrift: 0, timestamp: '45m ago' },
    { id: 'FC-110', caseId: 'TKT-71317', riskScore: 86, customerName: 'Anita Joshi', customerPhone: '11XX-XXX-258', value: 24500, status: 'Under Review', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '4h ago' },
    { id: 'FC-111', caseId: 'TKT-71250', riskScore: 88, customerName: 'Ravi Thakur', customerPhone: '10XX-XXX-369', value: 31200, status: 'Open', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-112', caseId: 'TKT-71183', riskScore: 85, customerName: 'Sonia Bhatia', customerPhone: '09XX-XXX-741', value: 19800, status: 'Under Review', channel: 'Email', courierPartner: 'N/A', gpsDrift: 0, timestamp: '5h ago' },
    { id: 'FC-113', caseId: 'TKT-71116', riskScore: 90, customerName: 'Kiran Verma', customerPhone: '08XX-XXX-852', value: 35600, status: 'Open', channel: 'Ticket', courierPartner: 'N/A', gpsDrift: 0, timestamp: '30m ago' },
    { id: 'FC-114', caseId: 'TKT-71049', riskScore: 83, customerName: 'Deepak Chaturvedi', customerPhone: '07XX-XXX-963', value: 17200, status: 'Under Review', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '6h ago' },
    { id: 'FC-115', caseId: 'TKT-70982', riskScore: 87, customerName: 'Madhuri Pandey', customerPhone: '06XX-XXX-147', value: 27800, status: 'Open', channel: 'Voice Transcript', courierPartner: 'N/A', gpsDrift: 0, timestamp: '2h ago' },
    { id: 'FC-116', caseId: 'TKT-70915', riskScore: 84, customerName: 'Nikhil Tiwari', customerPhone: '05XX-XXX-258', value: 20300, status: 'Under Review', channel: 'Email', courierPartner: 'N/A', gpsDrift: 0, timestamp: '7h ago' },
    { id: 'FC-117', caseId: 'TKT-70848', riskScore: 91, customerName: 'Swati Mishra', customerPhone: '04XX-XXX-369', value: 38900, status: 'Open', channel: 'Ticket', courierPartner: 'N/A', gpsDrift: 0, timestamp: '1h ago' },
    { id: 'FC-118', caseId: 'TKT-70781', riskScore: 86, customerName: 'Abhishek Dubey', customerPhone: '03XX-XXX-741', value: 23400, status: 'Under Review', channel: 'Chat', courierPartner: 'N/A', gpsDrift: 0, timestamp: '3h ago' },
  ],
};

// Pre-computed pattern stats (volume & exposure) for reuse
export const patternStats: Record<string, { volume: number; exposure: number }> = Object.fromEntries(
  Object.entries(patternCases).map(([patternId, cases]) => {
    const exposure = cases.reduce((sum, item) => sum + item.value, 0);
    return [patternId, { volume: cases.length, exposure }];
  })
);

export const getPatternStats = (patternId: string) => patternStats[patternId] || { volume: 0, exposure: 0 };

// Pattern-specific risk scores (updated values)
const patternRiskScores: Record<string, number> = {
  'FI-001': 71,  // Delivery Liability Risk
  'FI-002': 40,  // Internal Policy Violations
  'FI-003': 55,  // Non-Resalable Returns
  'FI-004': 75,  // Marketing Budget Waste
  'FI-005': 60,  // Organized Fraud Rings
  'FI-006': 80,  // Reputation Ransom Attacks
  'FI-007': 42,  // Refund-as-a-Service (RaaS) Signals
  'FI-008': 68,  // Cross-Channel Arbitration
};

export const getPatternRiskScore = (patternId: string) => {
  return patternRiskScores[patternId] || 0;
};

// Get cases for a specific pattern
const getCasesForPattern = (patternId: string): ForensicCase[] => {
  return patternCases[patternId] || [];
};

// ============ AGENTS DATA ============
interface FlaggedAgent {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  riskScore: number;
  fraudCases: number;
  policyOverrides: number;
  goodwillAbuse: number;
  flaggedPhrases: string[];
  status: 'Active' | 'Under Investigation' | 'Suspended';
  trend: number;
}

const mockAgents: FlaggedAgent[] = [
  {
    id: 'AG-001',
    name: 'Rajesh Mehta',
    employeeId: 'EMP-4521',
    department: 'Returns & Refunds',
    riskScore: 94,
    fraudCases: 47,
    policyOverrides: 23,
    goodwillAbuse: 18,
    flaggedPhrases: ['I will override policy', 'Between us only'],
    status: 'Under Investigation',
    trend: 28,
  },
  {
    id: 'AG-002',
    name: 'Priya Sharma',
    employeeId: 'EMP-3892',
    department: 'Customer Support',
    riskScore: 87,
    fraudCases: 38,
    policyOverrides: 18,
    goodwillAbuse: 15,
    flaggedPhrases: ['Goodwill refund approved', 'No need for proof'],
    status: 'Active',
    trend: 15,
  },
  {
    id: 'AG-003',
    name: 'Amit Kumar',
    employeeId: 'EMP-5673',
    department: 'Escalations',
    riskScore: 78,
    fraudCases: 29,
    policyOverrides: 12,
    goodwillAbuse: 8,
    flaggedPhrases: ['Keep this between us', 'Special exception'],
    status: 'Active',
    trend: -5,
  },
  {
    id: 'AG-004',
    name: 'Sneha Reddy',
    employeeId: 'EMP-2341',
    department: 'Social Media Response',
    riskScore: 72,
    fraudCases: 23,
    policyOverrides: 9,
    goodwillAbuse: 12,
    flaggedPhrases: ['Avoid negative review', 'Reputation priority'],
    status: 'Active',
    trend: 18,
  },
  {
    id: 'AG-005',
    name: 'Vikram Thapar',
    employeeId: 'EMP-6789',
    department: 'Voice Support',
    riskScore: 65,
    fraudCases: 18,
    policyOverrides: 7,
    goodwillAbuse: 5,
    flaggedPhrases: ['Manager approval not needed', 'Trust me'],
    status: 'Active',
    trend: -3,
  },
];

// Pattern-specific agent counts (varied, bounded by available agents)
const patternAgentCounts: Record<string, number> = {
  'FI-001': 3,
  'FI-002': 4,
  'FI-003': 2,
  'FI-004': 1,
  'FI-005': 3,
  'FI-006': 1,
  'FI-007': 2,
  'FI-008': 3,
};

export const getPatternAgentsCount = (patternId: string) =>
  Math.max(0, Math.min(patternAgentCounts[patternId] ?? 1, mockAgents.length));

// ============ PINCODES DATA ============
interface RiskyPincode {
  id: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  fraudCases: number;
  totalExposure: number;
  topCategory: string;
  trend: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  courierIssues: string[];
}

const mockPincodes: RiskyPincode[] = [
  {
    id: 'PC-001',
    pincode: '110001',
    area: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    fraudCases: 156,
    totalExposure: 2340000,
    topCategory: 'Fulfillment Fraud',
    trend: 23,
    riskLevel: 'Critical',
    courierIssues: ['GPS Spoofing', 'Fake POD'],
  },
  {
    id: 'PC-002',
    pincode: '400001',
    area: 'Fort',
    city: 'Mumbai',
    state: 'Maharashtra',
    fraudCases: 134,
    totalExposure: 1890000,
    topCategory: 'Syndicated Claims',
    trend: 18,
    riskLevel: 'Critical',
    courierIssues: ['Weight Mismatch', 'Seal Tampering'],
  },
  {
    id: 'PC-003',
    pincode: '560001',
    area: 'MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    fraudCases: 98,
    totalExposure: 1250000,
    topCategory: 'Incentive Fraud',
    trend: -5,
    riskLevel: 'High',
    courierIssues: ['Multiple Accounts', 'Device Fingerprint'],
  },
  {
    id: 'PC-004',
    pincode: '600001',
    area: 'George Town',
    city: 'Chennai',
    state: 'Tamil Nadu',
    fraudCases: 76,
    totalExposure: 980000,
    topCategory: 'Asset Abuse',
    trend: 12,
    riskLevel: 'High',
    courierIssues: ['Tag Removal', 'Used Items'],
  },
  {
    id: 'PC-005',
    pincode: '700001',
    area: 'BBD Bagh',
    city: 'Kolkata',
    state: 'West Bengal',
    fraudCases: 54,
    totalExposure: 670000,
    topCategory: 'Insider Collusion',
    trend: 8,
    riskLevel: 'Medium',
    courierIssues: ['Agent Override', 'Policy Bypass'],
  },
  {
    id: 'PC-006',
    pincode: '500001',
    area: 'Abids',
    city: 'Hyderabad',
    state: 'Telangana',
    fraudCases: 65,
    totalExposure: 780000,
    topCategory: 'Brand Extortion',
    trend: 31,
    riskLevel: 'High',
    courierIssues: ['Social Threats', 'Review Attacks'],
  },
  {
    id: 'PC-007',
    pincode: '380001',
    area: 'Lal Darwaja',
    city: 'Ahmedabad',
    state: 'Gujarat',
    fraudCases: 54,
    totalExposure: 920000,
    topCategory: '3rd Party Fraud',
    trend: 45,
    riskLevel: 'Critical',
    courierIssues: ['Pro Refunders', 'Fraud Networks'],
  },
  {
    id: 'PC-008',
    pincode: '302001',
    area: 'MI Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    fraudCases: 43,
    totalExposure: 540000,
    topCategory: 'Policy Arbitrage',
    trend: 22,
    riskLevel: 'Medium',
    courierIssues: ['Channel Hopping', 'Escalation Hunt'],
  },
];

// ============ PROPS ============
interface ForensicEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patternTitle: string;
  patternId: string;
  totalExposure: number;
  totalVolume: number;
  viewType: 'cases' | 'agents' | 'pincodes';
}

// ============ HELPER FUNCTIONS ============
const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

const getRiskScoreColor = (score: number) => {
  if (score >= 90) return 'bg-red-500 text-white';
  if (score >= 80) return 'bg-orange-500 text-white';
  if (score >= 70) return 'bg-yellow-500 text-black';
  return 'bg-green-500 text-white';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Escalated': 
    case 'Suspended':
    case 'Critical':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Open': 
    case 'Under Investigation':
    case 'High':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Under Review':
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Resolved':
    case 'Active':
    case 'Low':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: 
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'Chat': return <MessageSquare className="w-3 h-3" />;
    case 'Email': return <Mail className="w-3 h-3" />;
    case 'Voice Transcript': return <Phone className="w-3 h-3" />;
    case 'Ticket': return <Ticket className="w-3 h-3" />;
    case 'Trustpilot': return <Twitter className="w-3 h-3" />;
    case 'X (Twitter)': return <Twitter className="w-3 h-3" />;
    case 'Reddit': return <Twitter className="w-3 h-3" />;
    case 'App Store': return <Twitter className="w-3 h-3" />;
    case 'Play Store': return <Twitter className="w-3 h-3" />;
    default: return <MessageSquare className="w-3 h-3" />;
  }
};

const getChannelColor = (channel: string) => {
  switch (channel) {
    case 'Chat': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Email': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'Voice Transcript': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Ticket': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Trustpilot': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'X (Twitter)': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'Reddit': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'App Store': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'Play Store': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

// ============ MAIN COMPONENT ============
export default function ForensicEvidenceModal({
  isOpen,
  onClose,
  patternTitle,
  patternId,
  totalExposure,
  totalVolume,
  viewType,
}: ForensicEvidenceModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  if (!isOpen) return null;

  const mockCases = getCasesForPattern(patternId);
  const agentsForPattern = mockAgents.slice(0, getPatternAgentsCount(patternId));

  const getTitle = () => {
    switch (viewType) {
      case 'cases': return 'High-Risk Cases';
      case 'agents': return 'Flagged Agents';
      case 'pincodes': return 'Risky Pincodes';
      default: return 'Forensic Analysis';
    }
  };

  const getIcon = () => {
    switch (viewType) {
      case 'cases': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'agents': return <Users className="w-5 h-5 text-purple-400" />;
      case 'pincodes': return <MapPin className="w-5 h-5 text-blue-400" />;
      default: return <Shield className="w-5 h-5 text-red-400" />;
    }
  };

  const getIconBg = () => {
    switch (viewType) {
      case 'cases': return 'bg-red-500/10';
      case 'agents': return 'bg-purple-500/10';
      case 'pincodes': return 'bg-blue-500/10';
      default: return 'bg-red-500/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Panel */}
      <div className="relative w-[85%] max-w-[1400px] bg-slate-900 border-l border-white/10 flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/10 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${getIconBg()}`}>
                  {getIcon()}
                </div>
                <div>
                  <h2 className="text-white text-xl font-semibold">{patternTitle}</h2>
                  <p className="text-gray-500 text-sm">{getTitle()}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Total Exposure:</span>
                  <span className="text-red-400 text-lg font-bold">{formatCurrency(totalExposure)}</span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Volume:</span>
                  <span className="text-white text-lg font-bold">{totalVolume.toLocaleString()} cases</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Cases View */}
          {viewType === 'cases' && (
            <div className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-white text-sm font-semibold">Fraud Cases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Case ID</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Risk</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Channel</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Value</th>
                      <th className="text-left py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mockCases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">{caseItem.caseId}</span>
                            <span className="text-gray-500 text-xs">{caseItem.timestamp}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${getRiskScoreColor(caseItem.riskScore)}`}>
                            {caseItem.riskScore}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-white text-sm">{caseItem.customerName}</span>
                            <span className="text-gray-500 text-xs">{caseItem.customerPhone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 ${getChannelColor(caseItem.channel)}`}>
                            {getChannelIcon(caseItem.channel)}
                            {caseItem.channel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-red-400 text-sm font-medium">{formatCurrency(caseItem.value)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Agents View */}
          {viewType === 'agents' && (
            <div className="space-y-4">
              {agentsForPattern.map((agent) => (
                <div key={agent.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{agent.name}</h4>
                        <p className="text-gray-500 text-sm">{agent.employeeId} • {agent.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded font-bold ${getRiskScoreColor(agent.riskScore)}`}>
                        Risk: {agent.riskScore}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-red-400 text-xl font-bold">{agent.fraudCases}</div>
                      <div className="text-gray-500 text-xs">Fraud Cases</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-orange-400 text-xl font-bold">{agent.policyOverrides}</div>
                      <div className="text-gray-500 text-xs">Policy Overrides</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-yellow-400 text-xl font-bold">{agent.goodwillAbuse}</div>
                      <div className="text-gray-500 text-xs">Goodwill Abuse</div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Flagged Phrases</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {agent.flaggedPhrases.map((phrase, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/20">
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pincodes View */}
          {viewType === 'pincodes' && (
            <div className="space-y-4">
              {mockPincodes.map((pincode) => (
                <div key={pincode.id} className="bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{pincode.pincode}</h4>
                        <p className="text-gray-500 text-sm">{pincode.area}, {pincode.city}</p>
                        <p className="text-gray-600 text-xs">{pincode.state}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(pincode.riskLevel)}`}>
                        {pincode.riskLevel}
                      </span>
                      <div className={`flex items-center gap-1 text-sm font-medium ${pincode.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {pincode.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {pincode.trend > 0 ? '+' : ''}{pincode.trend}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-white text-xl font-bold">{pincode.fraudCases}</div>
                      <div className="text-gray-500 text-xs">Fraud Cases</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-red-400 text-xl font-bold">{formatCurrency(pincode.totalExposure)}</div>
                      <div className="text-gray-500 text-xs">Total Exposure</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                      <div className="text-orange-400 text-sm font-medium">{pincode.topCategory}</div>
                      <div className="text-gray-500 text-xs">Top Category</div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Courier Issues</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pincode.courierIssues.map((issue, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 rounded border border-orange-500/20">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Animation styles */}
        <style jsx>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}

