/**
 * OrgBadge — Shows organization plan tier in nav/sidebar
 */
const planColors = {
    free: { bg: 'rgba(160,160,176,0.15)', text: '#a0a0b0', border: 'rgba(160,160,176,0.3)', label: 'Free' },
    starter: { bg: 'rgba(74,222,128,0.12)', text: '#4ade80', border: 'rgba(74,222,128,0.3)', label: 'Starter' },
    pro: { bg: 'rgba(139,113,255,0.15)', text: '#8B71FF', border: 'rgba(139,113,255,0.4)', label: 'Pro ⚡' },
    enterprise: { bg: 'rgba(251,191,36,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.3)', label: 'Enterprise 👑' }
};

export default function OrgBadge({ plan = 'free', orgName = null }) {
    const colors = planColors[plan] || planColors.free;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)'
        }}>
            {orgName && (
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🏢 {orgName}
                </span>
            )}
            <span style={{
                display: 'inline-flex', alignItems: 'center',
                fontSize: 11, fontWeight: 700,
                color: colors.text,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 20, padding: '2px 10px',
                width: 'fit-content', letterSpacing: '0.5px',
                textTransform: 'uppercase'
            }}>
                {colors.label}
            </span>
        </div>
    );
}
