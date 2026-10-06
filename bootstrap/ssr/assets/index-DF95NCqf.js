import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { D as DashboardLayout } from "./DashboardLayout-DxX86PMJ.js";
import { Head, router } from "@inertiajs/react";
import { FaSearch, FaEnvelope, FaStar, FaArrowLeft, FaReply, FaTrash, FaUserCircle, FaPaperPlane, FaEnvelopeOpen, FaInbox } from "react-icons/fa";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog-DWtOe474.js";
import axios from "axios";
import Eyebrow from "./Eyebrow-BL4QDtth.js";
import "@headlessui/react";
import "react-icons/fi";
import "./logoutUrl-IEIiw7Wd.js";
import "./SearchBox-DRAFp6FV.js";
import "./FormatePrice-CMWyewFT.js";
import "./languageStore-DF0bQFKG.js";
import "zustand";
import "zustand/middleware";
import "sonner";
import "react-icons/fa6";
import "./WhatsAppChatButton-CDSWQr0H.js";
const Messages = ({ auth, contacts: initialContacts, unreadCount: initialUnreadCount, filters }) => {
  const [activeTab, setActiveTab] = useState(() => {
    return filters?.filter === "unread" || filters?.filter === "starred" ? filters.filter : "inbox";
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [replyMessage, setReplyMessage] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const messagesEndRef = useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contacts, setContacts] = useState(
    Array.isArray(initialContacts?.data) ? initialContacts.data : []
  );
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount || 0);
  const isAdmin = auth.user?.role === "admin" || auth.user?.role === "superadmin";
  useEffect(() => {
    if (initialContacts?.data && Array.isArray(initialContacts.data)) {
      setContacts(initialContacts.data);
    }
  }, [initialContacts]);
  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);
  useEffect(() => {
    if (selectedContact) {
      loadReplies(selectedContact.id);
    } else {
      setReplies([]);
    }
  }, [selectedContact]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [replies]);
  const loadReplies = async (contactId) => {
    setLoadingReplies(true);
    try {
      const response = await axios.get(route("contact.replies", contactId));
      if (response.data.success) {
        setReplies(response.data.replies);
      }
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      setLoadingReplies(false);
    }
  };
  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts) || contacts.length === 0) return [];
    return contacts.filter((contact) => {
      if (activeTab === "unread" && contact.is_read) return false;
      if (activeTab === "starred" && !contact.is_starred) return false;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        return (contact.name?.toLowerCase() || "").includes(searchLower) || (contact.email?.toLowerCase() || "").includes(searchLower) || (contact.subject?.toLowerCase() || "").includes(searchLower) || (contact.message?.toLowerCase() || "").includes(searchLower);
      }
      return true;
    });
  }, [contacts, activeTab, searchTerm]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedContact(null);
    setShowMobileList(true);
    router.get(route("dashboard.messages"), {
      filter: tab === "inbox" ? void 0 : tab,
      search: searchTerm || void 0
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true
    });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("dashboard.messages"), {
      filter: activeTab === "inbox" ? void 0 : activeTab,
      search: searchTerm || void 0
    }, {
      preserveState: true,
      replace: true,
      preserveScroll: true
    });
  };
  const toggleStar = (contactId, e) => {
    e.stopPropagation();
    setContacts(
      (prev) => prev.map((c) => c.id === contactId ? { ...c, is_starred: !c.is_starred } : c)
    );
    if (selectedContact?.id === contactId) {
      setSelectedContact((prev) => prev ? { ...prev, is_starred: !prev.is_starred } : null);
    }
    router.post(route("contacts.toggle-star", contactId), {}, {
      preserveScroll: true,
      preserveState: true,
      onError: (errors) => {
        console.error("Error toggling star:", errors);
        setContacts(
          (prev) => prev.map((c) => c.id === contactId ? { ...c, is_starred: !c.is_starred } : c)
        );
        if (selectedContact?.id === contactId) {
          setSelectedContact((prev) => prev ? { ...prev, is_starred: !prev.is_starred } : null);
        }
      }
    });
  };
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setShowMobileList(false);
    if (!contact.is_read) {
      setContacts(
        (prev) => prev.map((c) => c.id === contact.id ? { ...c, is_read: true } : c)
      );
      setSelectedContact({ ...contact, is_read: true });
      setIsUpdating(true);
      router.post(route("contacts.mark-single-read", contact.id), {}, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.reload({ only: ["unreadCount"] });
          setIsUpdating(false);
        },
        onError: (errors) => {
          console.error("Mark read failed:", errors);
          setContacts(
            (prev) => prev.map((c) => c.id === contact.id ? { ...c, is_read: false } : c)
          );
          setSelectedContact(contact);
          setIsUpdating(false);
        }
      });
    }
  };
  const handleReply = (contact) => {
    if (!isAdmin) {
      alert("Only administrators can reply to messages");
      return;
    }
    setReplyMessage("");
    setReplyError(null);
    scrollToReplyForm();
  };
  const replyTextareaRef = useRef(null);
  const scrollToReplyForm = () => {
    replyTextareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => replyTextareaRef.current?.focus(), 300);
  };
  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return;
    if (!isAdmin) {
      alert("Only administrators can reply to messages");
      return;
    }
    setIsSendingReply(true);
    setReplyError(null);
    try {
      const response = await axios.post(route("reply.message"), {
        contact_id: selectedContact.id,
        message: replyMessage.trim()
      });
      if (response.data.success) {
        const newReply = response.data.reply;
        setReplies((prev) => [...prev, newReply]);
        setReplyMessage("");
        alert("Reply sent successfully!");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      setReplyError(
        error.response?.data?.message || "Failed to send reply. Please try again."
      );
    } finally {
      setIsSendingReply(false);
    }
  };
  const openDeleteDialog = (contact, e) => {
    e.stopPropagation();
    setContactToDelete(contact);
    setShowDeleteDialog(true);
  };
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setContactToDelete(null);
    setIsDeleting(false);
  };
  const handleDeleteConfirm = () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    router.delete(route("contacts.destroy", contactToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id));
        if (selectedContact?.id === contactToDelete.id) {
          setSelectedContact(null);
          setShowMobileList(true);
        }
        setShowDeleteDialog(false);
        setContactToDelete(null);
        setIsDeleting(false);
      },
      onError: (errors) => {
        console.error("Error deleting contact:", errors);
        setIsDeleting(false);
      }
    });
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };
  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF5A1F&color=fff&bold=true&size=128`;
  };
  const getTabIcon = (tab) => {
    switch (tab) {
      case "inbox":
        return /* @__PURE__ */ jsx(FaInbox, { className: "mr-1" });
      case "unread":
        return /* @__PURE__ */ jsx(FaEnvelope, { className: "mr-1" });
      case "starred":
        return /* @__PURE__ */ jsx(FaStar, { className: "mr-1" });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs(DashboardLayout, { user: auth.user, children: [
    /* @__PURE__ */ jsx(Head, { title: "Messages" }),
    /* @__PURE__ */ jsx("div", { className: "bg-paper-dim", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Manage customer messages" }),
        /* @__PURE__ */ jsx("h1", { className: "text-[30px] sm:text-[36px] lg:text-[44px]", children: "Messages" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-soft mt-1", children: unreadCount > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
          "You have ",
          /* @__PURE__ */ jsxs("span", { className: "font-semibold text-marigold", children: [
            unreadCount,
            " unread"
          ] }),
          " messages"
        ] }) : "View and manage contact form submissions" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: `${showMobileList ? "block" : "hidden"} lg:block lg:col-span-1`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line h-full flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-line", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(FaSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search messages...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "flex border-b border-line", children: ["inbox", "unread", "starred"].map((tab) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleTabChange(tab),
              className: `flex-1 py-3 text-sm font-medium capitalize flex items-center justify-center ${activeTab === tab ? "text-marigold border-b-2 border-marigold" : "text-text-soft hover:text-ink hover:bg-paper-dim"}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
                  getTabIcon(tab),
                  tab
                ] }),
                tab === "unread" && unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 px-2 py-0.5 bg-marigold/10 text-marigold text-xs rounded-full", children: unreadCount })
              ]
            },
            tab
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto max-h-[calc(100vh-300px)] relative", children: [
            isUpdating && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-marigold" }) }),
            filteredContacts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
              /* @__PURE__ */ jsx(FaEnvelope, { className: "h-16 w-16 text-text-soft mx-auto mb-4" }),
              /* @__PURE__ */ jsx("p", { className: "text-ink font-medium", children: "No messages found" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft mt-1", children: searchTerm ? "Try a different search term" : "Your inbox is empty" })
            ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-line", children: filteredContacts.map((contact) => /* @__PURE__ */ jsx(
              "div",
              {
                className: `p-4 hover:bg-paper-dim cursor-pointer transition-all ${selectedContact?.id === contact.id ? "bg-marigold/5" : ""} ${!contact.is_read ? "bg-marigold/5" : ""}`,
                onClick: () => handleContactSelect(contact),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full overflow-hidden bg-marigold/10", children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: getAvatarUrl(contact.name),
                        alt: contact.name,
                        className: "w-full h-full object-cover",
                        onError: (e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=FF5A1F&color=fff&bold=true`;
                        }
                      }
                    ) }),
                    !contact.is_read && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-3 h-3 bg-marigold rounded-full ring-2 ring-white" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                      /* @__PURE__ */ jsx("h4", { className: "font-semibold text-ink truncate", children: contact.name }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 flex-shrink-0", children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: (e) => toggleStar(contact.id, e),
                            className: "hover:scale-110 transition-transform focus:outline-none",
                            title: contact.is_starred ? "Unstar" : "Star",
                            children: /* @__PURE__ */ jsx(
                              FaStar,
                              {
                                className: `h-3 w-3 ${contact.is_starred ? "text-yellow-500" : "text-text-soft hover:text-yellow-500"}`
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft whitespace-nowrap", children: formatDate(contact.created_at).split(",")[0] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mb-1", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-text-soft bg-paper-dim px-2 py-0.5 rounded-full truncate inline-block max-w-full", children: contact.subject }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-text-soft truncate mb-1", children: contact.message.length > 60 ? contact.message.substring(0, 60) + "..." : contact.message }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-text-soft truncate max-w-[150px]", children: contact.email }),
                      !contact.is_read && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-marigold/10 text-marigold text-xs font-medium rounded-full", children: "New" })
                    ] })
                  ] })
                ] })
              },
              contact.id
            )) })
          ] }),
          initialContacts?.total > 0 && /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-line text-xs text-text-soft", children: [
            "Showing ",
            initialContacts.from || 0,
            " - ",
            initialContacts.to || 0,
            " of ",
            initialContacts.total,
            " messages"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: `${!showMobileList ? "block" : "hidden"} lg:block lg:col-span-3`, children: selectedContact ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line h-full flex flex-col", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowMobileList(true),
                  className: "lg:hidden p-2 text-text-soft hover:text-marigold hover:bg-paper-dim rounded-xl transition-colors",
                  title: "Back to list",
                  children: /* @__PURE__ */ jsx(FaArrowLeft, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full overflow-hidden bg-marigold/10", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: getAvatarUrl(selectedContact.name),
                  alt: selectedContact.name,
                  className: "w-full h-full object-cover"
                }
              ) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink", children: selectedContact.name }),
                /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: selectedContact.email }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft mt-1", children: [
                  "Received: ",
                  formatDate(selectedContact.created_at)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              isAdmin && /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleReply(),
                  className: "inline-flex items-center gap-2 px-4 py-2 bg-marigold hover:bg-marigold-dark text-white rounded-xl transition-all duration-300 hover:shadow-lg",
                  children: [
                    /* @__PURE__ */ jsx(FaReply, { className: "h-4 w-4" }),
                    "Reply"
                  ]
                }
              ),
              isAdmin && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => openDeleteDialog(selectedContact, e),
                  className: "p-2 text-text-soft hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors",
                  title: "Delete",
                  children: /* @__PURE__ */ jsx(FaTrash, { className: "h-5 w-5" })
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white border border-line rounded-xl p-6 shadow-hard-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full overflow-hidden bg-marigold/10 mr-3", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: getAvatarUrl(selectedContact.name),
                    alt: selectedContact.name,
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-ink", children: selectedContact.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: formatDate(selectedContact.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-4 pb-4 border-b border-line", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-ink", children: "Subject: " }),
                /* @__PURE__ */ jsx("span", { className: "text-text-soft", children: selectedContact.subject })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft whitespace-pre-wrap leading-relaxed", children: selectedContact.message })
            ] }),
            loadingReplies ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-marigold" }) }) : replies.map((reply) => /* @__PURE__ */ jsxs("div", { className: "bg-marigold/5 border border-marigold/20 rounded-xl p-6 ml-8 shadow-hard-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
                /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full overflow-hidden bg-marigold/10 mr-3", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-marigold text-white", children: /* @__PURE__ */ jsx(FaUserCircle, { className: "w-6 h-6" }) }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-semibold text-ink", children: reply.user?.name || reply.author_name }),
                    /* @__PURE__ */ jsx("span", { className: "ml-2 px-2 py-0.5 bg-marigold/10 text-marigold text-xs font-medium rounded-full", children: "Admin" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-text-soft", children: formatDate(reply.created_at) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-text-soft whitespace-pre-wrap leading-relaxed", children: reply.message })
            ] }, reply.id)),
            isAdmin && /* @__PURE__ */ jsx("div", { className: "bg-paper-dim rounded-xl p-4 mt-4 border border-line", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full overflow-hidden bg-marigold/10", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: getAvatarUrl(auth.user?.name || "Admin"),
                  alt: "Admin",
                  className: "w-full h-full object-cover"
                }
              ) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    ref: replyTextareaRef,
                    rows: 2,
                    placeholder: "Type your reply here...",
                    value: replyMessage,
                    onChange: (e) => setReplyMessage(e.target.value),
                    className: "w-full px-3 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                  }
                ),
                replyError && /* @__PURE__ */ jsx("div", { className: "mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl", children: replyError }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-2", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: sendReply,
                    disabled: !replyMessage.trim() || isSendingReply,
                    className: "inline-flex items-center gap-2 px-4 py-2 bg-marigold hover:bg-marigold-dark text-white rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                    children: isSendingReply ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }),
                      "Sending..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(FaPaperPlane, { className: "h-4 w-4" }),
                      "Send Reply"
                    ] })
                  }
                ) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
          ] }) })
        ] }) : /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl shadow-hard-sm border border-line h-full flex flex-col items-center justify-center p-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md", children: [
          /* @__PURE__ */ jsx(FaEnvelopeOpen, { className: "h-24 w-24 text-text-soft mx-auto mb-6" }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-3", children: "Select a Message" }),
          /* @__PURE__ */ jsx("p", { className: "text-text-soft", children: "Choose a message from the sidebar to view its details and reply to the customer." }),
          filteredContacts.length > 0 && /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-soft mt-4", children: [
            "You have ",
            filteredContacts.length,
            " message",
            filteredContacts.length !== 1 ? "s" : "",
            " in this view"
          ] })
        ] }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: showDeleteDialog,
        onClose: handleDeleteCancel,
        onConfirm: handleDeleteConfirm,
        title: "Delete Message",
        message: contactToDelete ? `Are you sure you want to delete the message from ${contactToDelete.name}? This action cannot be undone.` : "Are you sure you want to delete this message? This action cannot be undone.",
        isDeleting
      }
    )
  ] });
};
export {
  Messages as default
};
