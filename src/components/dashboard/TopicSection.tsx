// src/components/dashboard/TopicSection.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TopicList from './TopicList';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { type Topic, deleteTopic, fetchAllTopics } from '../../api/topics';
import { useNavigate } from 'react-router-dom';
import AddTopicButton from './AddTopicButton';

interface TopicSectionProps {
    userId: string | null;
    // onTopicsChange?: (newTopics: Topic[] | ((prev: Topic[]) => Topic[])) => void; // allow functional update
}

const TopicSection: React.FC<TopicSectionProps> = ({ userId }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleEditTopicClick = useCallback((topic: Topic) => {
        navigate(`/dashboard/topics/${topic.id}/questions`);
    }, [navigate]);

    const handleStartQuiz = useCallback((topic: Topic) => {
        navigate(`/dashboard/topics/${topic.id}/quiz`);
    }, [navigate]);

    const loadTopics = useCallback(async () => {
        try {
            setLoadingTopics(true);
            setError(null);
            const fetchedTopics = await fetchAllTopics();
            setTopics(fetchedTopics);
        } catch (err: any) {
            setError('שגיאה בטעינת נושאים: ' + err.message);
            console.error('Error fetching topics:', err);
        } finally {
            setLoadingTopics(false);
        }
    }, []);

    useEffect(() => {
        if (userId) loadTopics();
    }, [userId, loadTopics]);

    const handleDeleteClick = (topic: Topic) => {
        setTopicToDelete(topic);
        setShowConfirmDelete(true);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!topicToDelete) return;
        setDeleting(true);
        try {
            await deleteTopic(topicToDelete.id);
            const updated = topics.filter(t => t.id !== topicToDelete.id);
            setTopics(updated);
            // onTopicsChange?.(updated);
            setShowConfirmDelete(false);
            setTopicToDelete(null);
        } catch (err: any) {
            console.error('Error deleting topic:', err);
            setDeleteError(err.message || 'שגיאה במחיקת נושא. אנא נסה שוב.');
        } finally {
            setDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setTopicToDelete(null);
        setDeleteError(null);
    };

    return (
        <Box sx={{ mt: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <AddTopicButton userId={userId} onTopicAdded={(newTopic) => {
                    const updatedTopics = [...topics, newTopic];
                    setTopics(updatedTopics);
                }} />
                <Typography variant="h5" sx={{ mb: 2 }}>נושאים</Typography>
            </Box>

            <TopicList
                topics={topics}
                userId={userId} // העברת מזהה המשתמש ל-TopicList
                loading={loadingTopics}
                error={error}
                onDeleteTopic={handleDeleteClick}
                onEditTopic={handleEditTopicClick} // עדיין מועבר, לבעלים
                onStartQuiz={handleStartQuiz} // הקולבק החדש, למי שאינו בעלים
                deletingTopic={deleting}
            />

            <ConfirmationDialog
                open={showConfirmDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="אישור מחיקת נושא"
                message={`האם אתה בטוח שברצונך למחוק את הנושא "${topicToDelete?.name}"? פעולה זו בלתי הפיכה.`}
                confirmButtonText="מחק"
                cancelButtonText="ביטול"
                loading={deleting}
                error={deleteError}
            />
        </Box>
    );
};

export default TopicSection;
