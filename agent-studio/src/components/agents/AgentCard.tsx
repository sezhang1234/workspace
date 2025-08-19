'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  PlayArrow as PlayIcon,
  Publish as PublishIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Agent } from '@/store/agentStore';
import Link from 'next/link';

interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agentId: string) => void;
  onDuplicate?: (agent: Agent) => void;
  onPublish?: (agentId: string) => void;
  onArchive?: (agentId: string) => void;
}

export default function AgentCard({
  agent,
  onEdit,
  onDelete,
  onDuplicate,
  onPublish,
  onArchive,
}: AgentCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return '未知';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            height: 120,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {agent.name.charAt(0).toUpperCase()}
          </Typography>
        </Box>
        <Chip
          label={getStatusText(agent.status)}
          color={getStatusColor(agent.status) as any}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {agent.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {agent.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {agent.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
          {agent.tags.length > 3 && (
            <Chip
              label={`+${agent.tags.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}
        </Box>

        <Typography variant="caption" color="text.secondary">
          更新于 {format(new Date(agent.updatedAt), 'yyyy-MM-dd HH:mm')}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            component={Link}
            href={`/agents/${agent.id}`}
            startIcon={<EditIcon />}
          >
            编辑
          </Button>
          <Button
            size="small"
            variant="outlined"
            component={Link}
            href={`/chat/${agent.id}`}
            startIcon={<PlayIcon />}
          >
            测试
          </Button>
        </Box>

        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? 'agent-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="agent-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'agent-menu-button',
          }}
        >
          <MenuItem
            onClick={() => {
              onDuplicate?.(agent);
              handleClose();
            }}
          >
            <CopyIcon sx={{ mr: 1 }} />
            复制
          </MenuItem>
          {agent.status === 'draft' && (
            <MenuItem
              onClick={() => {
                onPublish?.(agent.id);
                handleClose();
              }}
            >
              <PublishIcon sx={{ mr: 1 }} />
              发布
            </MenuItem>
          )}
          {agent.status === 'published' && (
            <MenuItem
              onClick={() => {
                onArchive?.(agent.id);
                handleClose();
              }}
            >
              <ArchiveIcon sx={{ mr: 1 }} />
              归档
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              onDelete?.(agent.id);
              handleClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            删除
          </MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}