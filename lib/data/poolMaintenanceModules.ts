export interface PoolMaintenanceModule {
  id: string;
  title: string;
  duration: string;
  regulatoryFocus: string[];
  overview: string;
  procedures: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const poolMaintenanceModules: PoolMaintenanceModule[] = [
  {
    id: 'plant-room-foundations',
    title: 'Module 1: Plant Room Foundations & Safe Start-up',
    duration: '35 minutes',
    regulatoryFocus: ['HSG179', 'PWTAG Code of Practice'],
    overview:
      'Learn how to inspect pumps, strainers, circulation lines, and valves before first operation. This module builds a repeatable start-up sequence so operators can stabilise flow rates and avoid dead legs.',
    procedures: [
      'Complete a visual plant room walkdown and record pressure/flow baseline readings.',
      'Confirm inlet and return valves are in the operational position before energising pumps.',
      'Prime pumps safely and verify basket strainers are free from debris.',
      'Log startup readings in the operations sheet for trend comparison.',
    ],
    quiz: {
      question: 'What should be checked before energising a circulation pump?',
      options: [
        'Only that the backwash valve is open',
        'Valve positions, strainer condition, and baseline readings',
        'That dosing is disabled for 24 hours',
        'Only water temperature',
      ],
      correctIndex: 1,
      explanation:
        'Safe startup requires confirmation of valve line-up, clean strainers, and documented baseline readings so issues are detected early.',
    },
  },
  {
    id: 'water-testing-essentials',
    title: 'Module 2: Water Testing & Sampling Integrity',
    duration: '30 minutes',
    regulatoryFocus: ['PWTAG Technical Notes', 'HSG179'],
    overview:
      'Develop robust sampling habits using DPD methods, clear sample point hierarchy, and contamination prevention. Understand why poor sampling technique produces false confidence.',
    procedures: [
      'Collect samples from agreed points: deck-level return, balance tank, and make-up source.',
      'Rinse sample cells three times with pool water before testing.',
      'Record free chlorine, combined chlorine, pH, alkalinity, and water temperature.',
      'Trigger escalation when readings drift outside operating envelopes.',
    ],
    quiz: {
      question: 'Why is sample point consistency essential?',
      options: [
        'It allows trend analysis and reliable corrective action',
        'It removes the need for calibration',
        'It guarantees no retests are required',
        'It replaces microbiological testing',
      ],
      correctIndex: 0,
      explanation:
        'Consistent sampling locations make trend data meaningful and help operators choose the right corrective action quickly.',
    },
  },
  {
    id: 'chemical-dosing-control',
    title: 'Module 3: Chemical Dosing & Control Loops',
    duration: '40 minutes',
    regulatoryFocus: ['COSHH 2002', 'HSG179'],
    overview:
      'Master chlorine and pH control loops, setpoint management, and safe correction strategies that minimise bather disruption and chemical overfeed risk.',
    procedures: [
      'Verify dosing controller probes are clean and calibrated before shift start.',
      'Compare controller values with manual DPD checks and document variance.',
      'Adjust setpoints in small increments and allow circulation time before retesting.',
      'Use COSHH controls for storage, transfer, and spill response.',
    ],
    quiz: {
      question: 'What is the safest dosing adjustment method?',
      options: [
        'Large setpoint changes to force rapid correction',
        'Small setpoint changes with retest intervals',
        'Manual shock dosing every morning regardless of reading',
        'Disabling alarms during busy periods',
      ],
      correctIndex: 1,
      explanation:
        'Incremental adjustments with retest intervals prevent overshoot and maintain safe, stable chemistry.',
    },
  },
  {
    id: 'filtration-backwash',
    title: 'Module 4: Filtration Performance & Backwash',
    duration: '30 minutes',
    regulatoryFocus: ['PWTAG', 'Environment Agency discharge guidance'],
    overview:
      'Understand filter loading, differential pressure trends, and compliant backwash disposal routes to maintain clarity and hydraulic efficiency.',
    procedures: [
      'Track filter differential pressure against baseline to spot loading trends.',
      'Backwash according to trigger thresholds, not habit alone.',
      'Follow rinse sequence to prevent dirty return to pool water.',
      'Record discharge volumes and disposal method in environmental log.',
    ],
    quiz: {
      question: 'What should trigger backwash decisions?',
      options: [
        'Shift preference only',
        'Fixed day of week only',
        'Differential pressure and water quality indicators',
        'Whether the plant room is empty',
      ],
      correctIndex: 2,
      explanation:
        'Backwash should be evidence-led, using pressure trends and water quality indicators to avoid under or over-cleaning.',
    },
  },
  {
    id: 'electrical-safety',
    title: 'Module 5: Electrical Safety in Wet Environments',
    duration: '25 minutes',
    regulatoryFocus: ['Electricity at Work Regulations 1989'],
    overview:
      'Build confidence in lock-off procedures, isolation verification, and escalation boundaries for non-electrical specialists working around switchgear and pump controls.',
    procedures: [
      'Never bypass interlocks or safety cut-outs.',
      'Use lock-off and tag procedures before maintenance activity.',
      'Confirm dead with approved test devices where authorised.',
      'Escalate faults outside your competence to qualified electricians.',
    ],
    quiz: {
      question: 'What is a non-negotiable electrical control?',
      options: [
        'Troubleshooting with wet gloves for speed',
        'Bypassing an interlock to restore operation quickly',
        'Isolation and lock-off before maintenance',
        'Resetting unknown trips repeatedly',
      ],
      correctIndex: 2,
      explanation:
        'Isolation and lock-off are foundational controls under the Electricity at Work framework.',
    },
  },
  {
    id: 'microbiological-risk',
    title: 'Module 6: Microbiological Risk Prevention',
    duration: '35 minutes',
    regulatoryFocus: ['HSG179', 'PWTAG'],
    overview:
      'Identify high-risk scenarios for microbiological incidents and learn preventive routines around turnover, hygiene messaging, and incident response.',
    procedures: [
      'Maintain disinfectant residuals and pH in agreed operational windows.',
      'Confirm turnover rates and dead-zone mitigation weekly.',
      'Apply enhanced cleaning for changing and shower areas.',
      'Follow contamination incident protocol and communication script.',
    ],
    quiz: {
      question: 'Which action best reduces microbiological risk?',
      options: [
        'Reducing turnover to save energy',
        'Maintaining disinfectant residual and bather hygiene controls',
        'Skipping contamination drills',
        'Testing only when water looks cloudy',
      ],
      correctIndex: 1,
      explanation:
        'Consistent disinfectant control plus hygiene measures provide the strongest preventive barrier.',
    },
  },
  {
    id: 'incident-reporting',
    title: 'Module 7: Incident Reporting & RIDDOR Alignment',
    duration: '20 minutes',
    regulatoryFocus: ['RIDDOR 2013', 'HSE reporting guidance'],
    overview:
      'Learn to classify incidents accurately, capture evidence promptly, and prepare defensible records for internal review and statutory reporting requirements.',
    procedures: [
      'Stabilise area and preserve evidence where safe.',
      'Capture who/what/when/where details with witness notes.',
      'Escalate notifiable incidents through duty management chain.',
      'Submit records within organisational reporting deadlines.',
    ],
    quiz: {
      question: 'What is the first reporting priority after making the area safe?',
      options: [
        'Delete CCTV to protect privacy',
        'Capture factual evidence and witness details',
        'Wait 48 hours before logging',
        'Record only if media asks',
      ],
      correctIndex: 1,
      explanation:
        'Accurate, timely evidence capture supports legal compliance and robust follow-up actions.',
    },
  },
  {
    id: 'ppe-coshh',
    title: 'Module 8: PPE Standards & COSHH Storage',
    duration: '25 minutes',
    regulatoryFocus: ['PPE at Work Regulations 1992', 'COSHH 2002'],
    overview:
      'Ensure team members select and maintain correct PPE for handling treatment chemicals and understand segregation rules for oxidisers, acids, and alkalis.',
    procedures: [
      'Verify PPE issue, fit, and serviceability at shift start.',
      'Store incompatible chemicals separately with clear signage.',
      'Keep SDS packs accessible and current in plant room and office.',
      'Document near misses involving PPE or handling practice.',
    ],
    quiz: {
      question: 'Which storage approach is compliant?',
      options: [
        'Store all chemicals together to reduce travel',
        'Segregate incompatible chemicals with signage and controls',
        'Keep SDS in a locked drawer with no copies',
        'Use damaged gloves if stock is low',
      ],
      correctIndex: 1,
      explanation:
        'COSHH requires segregation of incompatible substances and immediate access to hazard information.',
    },
  },
  {
    id: 'drainage-compliance',
    title: 'Module 9: Environmental Drainage Compliance',
    duration: '30 minutes',
    regulatoryFocus: ['Environment Agency guidance', 'Building Regulations Part H'],
    overview:
      'Manage backwash and drained water responsibly, including dechlorination controls, sewer consent checks, and incident prevention near surface water drains.',
    procedures: [
      'Verify drain destination before discharge activity.',
      'Use dechlorination controls where consent requires.',
      'Record discharge date, volume, and receiving route.',
      'Report any accidental release immediately and activate containment plan.',
    ],
    quiz: {
      question: 'Why must drain routes be verified before discharge?',
      options: [
        'To avoid accidental release to surface waters',
        'To make paperwork optional',
        'To reduce filter lifespan',
        'To remove consent requirements',
      ],
      correctIndex: 0,
      explanation:
        'Incorrect discharge routing can cause environmental incidents and enforcement action.',
    },
  },
  {
    id: 'preventive-maintenance',
    title: 'Module 10: Preventive Maintenance Planning',
    duration: '35 minutes',
    regulatoryFocus: ['PWTAG operational best practice'],
    overview:
      'Create a practical maintenance cadence that blends daily checks with weekly and monthly planned tasks to reduce unplanned shutdowns.',
    procedures: [
      'Define task ownership for daily, weekly, and monthly maintenance.',
      'Use trend logs for vibration, pressure, and dosing demand changes.',
      'Schedule planned downtime windows for intrusive tasks.',
      'Review overdue tasks during supervisor handover.',
    ],
    quiz: {
      question: 'What is the main value of preventive maintenance?',
      options: [
        'It eliminates all failures forever',
        'It reduces unplanned outages and improves reliability',
        'It removes the need for inspections',
        'It guarantees lower chemical consumption every day',
      ],
      correctIndex: 1,
      explanation:
        'Preventive schedules reduce avoidable failures and help keep services stable.',
    },
  },
  {
    id: 'guest-safety-operations',
    title: 'Module 11: Guest Safety, Signage & Operations',
    duration: '25 minutes',
    regulatoryFocus: ['HSG179', 'Operational risk assessments'],
    overview:
      'Coordinate lifeguard, duty manager, and plant responses through clear communication, signage standards, and water closure thresholds.',
    procedures: [
      'Use standard scripts for temporary closure or swim advisory decisions.',
      'Confirm safety signage is visible, current, and multilingual where needed.',
      'Run opening briefing with lifeguard and operations teams.',
      'Escalate any unresolved safety conflict to duty manager immediately.',
    ],
    quiz: {
      question: 'When should a pool be temporarily closed?',
      options: [
        'Only when requested by guests',
        'When key safety or water quality thresholds are exceeded',
        'Never, to avoid complaints',
        'Only at the end of the day',
      ],
      correctIndex: 1,
      explanation:
        'Closures are justified when safety thresholds are breached and normal operation cannot be maintained safely.',
    },
  },
  {
    id: 'leadership-audit-readiness',
    title: 'Module 12: Leadership, Audits & Continuous Improvement',
    duration: '30 minutes',
    regulatoryFocus: ['Internal QA', 'HSE/PWTAG audit readiness'],
    overview:
      'Prepare supervisors to lead shift handovers, conduct mini-audits, and convert findings into measurable improvements for compliance and service quality.',
    procedures: [
      'Run concise shift handovers with unresolved actions and risk summary.',
      'Complete monthly audit checklist and evidence file review.',
      'Track CAPA actions to closure with accountable owners.',
      'Celebrate quality wins and brief lessons learned across teams.',
    ],
    quiz: {
      question: 'What demonstrates a strong continuous improvement culture?',
      options: [
        'Ignoring minor non-conformances',
        'Closing corrective actions and sharing lessons learned',
        'Auditing only before inspections',
        'Leaving actions unassigned',
      ],
      correctIndex: 1,
      explanation:
        'Effective teams close actions and communicate learning so issues do not repeat.',
    },
  },
];
