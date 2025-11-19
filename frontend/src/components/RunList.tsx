import { FC } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import { RunSummary } from '../api';

interface RunListProps {
  runs: RunSummary[];
  selectedRunId: number | null;
  onSelect: (runId: number) => void;
  onClear: () => void;
  loading?: boolean;
}

const RunList: FC<RunListProps> = ({ runs, selectedRunId, onSelect, onClear, loading = false }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!runs.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No evaluations have been executed yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ maxHeight: 520, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box p={2} borderBottom={1} borderColor="divider" display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          HISTORY
        </Typography>
        <Button size="small" color="error" onClick={onClear}>
          Clear
        </Button>
      </Box>
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List disablePadding>
          {runs.map((run) => {
            const accuracyMetric = run.metrics.find((metric) => metric.name.toLowerCase().includes('accuracy'));
            return (
              <ListItemButton
                key={run.id}
                selected={selectedRunId === run.id}
                onClick={() => onSelect(run.id)}
                sx={{ alignItems: 'flex-start', py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {run.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Completed {new Date(run.completed_at).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Config: {run.config_name}
                      </Typography>
                    </>
                  }
                />
                {accuracyMetric && (
                  <ListItemSecondaryAction>
                    <Chip
                      label={`Accuracy ${(accuracyMetric.value * 100).toFixed(1)}%`}
                      color="primary"
                      size="small"
                    />
                  </ListItemSecondaryAction>
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
};

export default RunList;
