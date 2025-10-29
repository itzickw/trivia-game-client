// src/components/dashboard/LevelSection.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import LevelList from './LevelList';
import EditLevelDialog from './EditLevelDialog';
import { type Level, updateLevel, type UpdateLevelDto, fetchAllLevels } from '../../api/levels';
import AddLevelButton from './AddLevelButton';

interface LevelSectionProps {
}

const LevelSection: React.FC<LevelSectionProps> = () => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loadingLevels, setLoadingLevels] = useState(false);
    const [levelsError, setLevelsError] = useState<string | null>(null);
    const [levelToEdit, setLevelToEdit] = useState<Level | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);


    const loadLevels = useCallback(async () => {
        try {
            setLoadingLevels(true);
            setLevelsError(null);
            const fetchedLevels = await fetchAllLevels();
            setLevels(fetchedLevels);
        } catch (err: any) {
            setLevelsError('שגיאה בטעינת רמות: ' + err.message);
            console.error('Error fetching levels:', err);
        } finally {
            setLoadingLevels(false);
        }
    }, []);

    useEffect(() => {
        loadLevels();
    }, [loadLevels]);

    const handleEditClick = (level: Level) => {
        setLevelToEdit(level);
        setShowEditDialog(true);
        setEditError(null);
    };

    const handleSave = async (levelId: string, updatedData: UpdateLevelDto) => {
        setEditing(true);
        setEditError(null);
        try {
            const updatedLevel = await updateLevel(levelId, updatedData);
            setLevels(levels.map(lvl => (lvl.id === updatedLevel.id ? updatedLevel : lvl)));
            setShowEditDialog(false);
            setLevelToEdit(null);
        } catch (err: any) {
            console.error('Error updating level:', err);
            setEditError(err.message || 'שגיאה בעדכון רמה. אנא נסה שוב.');
        } finally {
            setEditing(false);
        }
    };

    const handleCloseDialog = () => {
        setShowEditDialog(false);
        setLevelToEdit(null);
        setEditError(null);
    };

    useEffect(() => {
        loadLevels();
    }, [loadLevels]);

    return (
        <Box sx={{ mt: 4, width: '100%', margin: '1' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <AddLevelButton onLevelAdded={(newLevel) => {
                    const updatedLevels = [...levels, newLevel];
                    setLevels(updatedLevels);
                }} />
                <Typography variant="h5" sx={{ mb: 2 }}>שלבים</Typography>
            </Box>
            <LevelList
                levels={levels}
                loading={loadingLevels}
                error={levelsError}
                onEditLevel={handleEditClick}
                onDeleteLevel={() => { /* Implement if needed */ }}
            />

            <EditLevelDialog
                open={showEditDialog}
                onClose={handleCloseDialog}
                onSave={handleSave}
                loading={editing}
                error={editError}
                levelToEdit={levelToEdit}
            />
        </Box>
    );
};

export default LevelSection;
