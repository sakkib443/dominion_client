"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50 border border-gray-200 rounded-md animate-pulse" /> });
import 'react-quill-new/dist/quill.snow.css';
import Link from 'next/link';
import {
    FiArrowLeft, FiSave, FiImage, FiX, FiPlus, FiInfo,
    FiSettings, FiDollarSign, FiTag, FiShield, FiTruck,
    FiList, FiGlobe, FiTrash2, FiBox, FiCheckCircle,
    FiDroplet, FiFileText, FiPercent
} from 'react-icons/fi';
import {
    useCreateProductMutation,
    useUpdateProductMutation,
    useGetProductByIdQuery
} from '@/redux/api/productApi';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { toast } from 'react-hot-toast';

// ── Toggle Switch Component ──────────────────────────────────
const Toggle = ({ label, name, checked, onChange, color = 'bg-emerald-500' }: any) => (
    <label className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-md transition-all border border-gray-100 cursor-pointer group">
        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{label}</span>
        <div className="relative">
            <input type="checkbox" name={name} className="sr-only" checked={checked} onChange={onChange} />
            <div className={`w-11 h-6 rounded-full transition-colors ${checked ? color : 'bg-gray-200'}`}></div>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    </label>
);

// ── Input Component ──────────────────────────────────────────
const Input = ({ label, required, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">{label} {required && <span className="text-red-400">*</span>}</label>
        <input className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#0B4222] focus:ring-1 focus:ring-[#0B4222]/10 transition-all text-sm" {...props} />
    </div>
);

// ── Section Header Component ──────────────────────────────────
const SectionHeader = ({ icon, title, color = 'bg-blue-50 text-blue-600' }: any) => (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${color}`}>{icon}</div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
);

const ProductFormInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const isEditing = !!productId;

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const { data: productToEdit, isLoading: isFetching } = useGetProductByIdQuery(productId, { skip: !isEditing });
    const { data: categoriesData } = useGetCategoriesQuery({});

    const [formData, setFormData] = useState<any>({
        // Basic
        name: '', slug: '', sku: '', brand: '',
        description: '', tagline: '',
        priceType: 'negotiable',
        // Pricing
        price: 0, originalPrice: 0, costPrice: 0, discount: 0,
        // Media
        thumbnail: '', images: [],
        // Organization
        category: '', subcategory: '',
        // Stock
        stock: 0, lowStockThreshold: 5, unit: 'piece',
        // Status
        status: 'active', visibility: 'visible',
        isFeatured: false, isNewProduct: true, isOnSale: false,
        // Visual variants
        colors: [], colorHex: [], sizes: [], material: [],
        pattern: '', gender: '',
        // Tags & AI
        tags: [], aiLabels: [],
        // Specs & Highlights
        specifications: [], highlights: [],
        // Physical
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        // Content Tabs
        deliveryInfo: '', paymentInfo: '', termsInfo: '',
        // Shipping & Warranty
        shippingConfig: { freeShipping: false, shippingCost: 0, estimatedDays: 3 },
        warranty: { hasWarranty: false, duration: 0, durationUnit: 'months', type: 'manufacturer' },
        // SEO
        metaTitle: '', metaDescription: '', metaKeywords: [],
    });

    // Populate form if editing
    useEffect(() => {
        if (isEditing && productToEdit?.data) {
            const prod = productToEdit.data;
            setFormData({
                ...formData,
                ...prod,
                category: prod.category?._id || prod.category || '',
                subcategory: prod.subcategory?._id || prod.subcategory || '',
                warranty: prod.warranty || formData.warranty,
                shippingConfig: prod.shippingConfig || formData.shippingConfig,
                dimensions: prod.dimensions || formData.dimensions,
                specifications: prod.specifications || [],
                highlights: prod.highlights || [],
                tags: prod.tags || [],
                colors: prod.colors || [],
                colorHex: prod.colorHex || [],
                sizes: prod.sizes || [],
                material: prod.material || [],
                aiLabels: prod.aiLabels || [],
                metaKeywords: prod.metaKeywords || [],
                images: prod.images || [],
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, productToEdit]);

    // Auto-calculate discount
    useEffect(() => {
        if (formData.originalPrice > 0 && formData.price > 0 && formData.originalPrice > formData.price) {
            const disc = Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100);
            setFormData((prev: any) => ({ ...prev, discount: disc }));
        }
    }, [formData.price, formData.originalPrice]);

    // Auto-generate slug
    useEffect(() => {
        if (!isEditing && formData.name) {
            const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData((prev: any) => ({ ...prev, slug }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.name, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value) }
            }));
        } else {
            setFormData((prev: any) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
            }));
        }
    };

    // Array field handlers (comma-separated)
    const handleArrayChange = (name: string, value: string) => {
        const arr = value.split(',').map(s => s.trim()).filter(s => s !== '');
        setFormData((prev: any) => ({ ...prev, [name]: arr }));
    };

    // Images (newline-separated)
    const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const urls = e.target.value.split('\n').map(u => u.trim()).filter(u => u !== '');
        setFormData((prev: any) => ({ ...prev, images: urls }));
    };

    // Specifications
    const handleSpecChange = (idx: number, field: string, value: string) => {
        const specs = [...formData.specifications];
        specs[idx] = { ...specs[idx], [field]: value };
        setFormData((prev: any) => ({ ...prev, specifications: specs }));
    };
    const addSpec = () => setFormData((prev: any) => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
    const removeSpec = (idx: number) => {
        const specs = [...formData.specifications]; specs.splice(idx, 1);
        setFormData((prev: any) => ({ ...prev, specifications: specs }));
    };

    // Highlights
    const handleHighlightChange = (idx: number, value: string) => {
        const hl = [...formData.highlights]; hl[idx] = value;
        setFormData((prev: any) => ({ ...prev, highlights: hl }));
    };
    const addHighlight = () => setFormData((prev: any) => ({ ...prev, highlights: [...prev.highlights, ''] }));
    const removeHighlight = (idx: number) => {
        const hl = [...formData.highlights]; hl.splice(idx, 1);
        setFormData((prev: any) => ({ ...prev, highlights: hl }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.category) return toast.error('Please select a category');
        if (!formData.name) return toast.error('Product name is required');
        if (!formData.price) return toast.error('Price is required');

        try {
            const payload = { ...formData };
            // Clean empty optional fields
            if (!payload.subcategory) delete payload.subcategory;
            if (!payload.thumbnail) return toast.error('Thumbnail is required');

            if (isEditing) {
                await updateProduct({ id: productId, data: payload }).unwrap();
                toast.success('Product updated successfully');
            } else {
                await createProduct(payload).unwrap();
                toast.success('Product created successfully');
            }
            router.push('/dashboard/admin/products');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    if (isEditing && isFetching) return <div className="p-20 text-center text-[#0B4222] font-bold animate-pulse">Loading product data...</div>;

    const categories = categoriesData?.data || [];

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-32">
            {/* ══ ACTION BAR ═══════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-md border border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/products" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-400 transition-all hover:text-gray-600">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Product' : 'Create New Product'}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-green-500' : formData.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                            <p className="text-xs text-gray-500 capitalize">{formData.status}</p>
                            {formData.discount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{formData.discount}% OFF</span>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => router.push('/dashboard/admin/products')} className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-md font-semibold text-gray-600 hover:bg-gray-50 transition-all text-sm">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isCreating || isUpdating} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0B4222] text-white rounded-md font-semibold hover:bg-[#093519] transition-all shadow-md disabled:opacity-50 text-sm">
                        <FiSave size={18} />
                        {isCreating || isUpdating ? 'Saving...' : (isEditing ? 'Update Product' : 'Publish Product')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ══ LEFT COLUMN (8 cols) ════════════════════════════ */}
                <div className="lg:col-span-8 space-y-6">

                    {/* ── 1. Basic Information ──────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <SectionHeader icon={<FiInfo size={20} />} title="Basic Information" color="bg-blue-50 text-blue-600" />

                        <Input label="Product Name" name="name" required type="text" placeholder="e.g. 250L Piston Type Industrial Air Compressor" value={formData.name} onChange={handleChange} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Slug" name="slug" type="text" placeholder="auto-generated" value={formData.slug} onChange={handleChange} />
                            <Input label="SKU / Model" name="sku" type="text" placeholder="e.g. IND-1001" value={formData.sku} onChange={handleChange} />
                            <Input label="Brand" name="brand" type="text" placeholder="e.g. Lishan Group" value={formData.brand} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Tagline <span className="text-xs text-gray-400">(scrolling text on card)</span></label>
                                <input type="text" name="tagline" placeholder="Lower price than others but quality higher" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#0B4222] transition-all text-sm" value={formData.tagline} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Price Type</label>
                                <select name="priceType" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-semibold outline-none focus:border-[#0B4222] cursor-pointer" value={formData.priceType} onChange={handleChange}>
                                    <option value="negotiable">Negotiable</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Product Description</label>
                            <div className="product-editor-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(value: string) => setFormData((prev: any) => ({ ...prev, description: value }))}
                                    placeholder="Write detailed product description..."
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                            [{ 'font': [] }],
                                            [{ 'size': ['small', false, 'large', 'huge'] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'color': [] }, { 'background': [] }],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                            [{ 'align': [] }],
                                            ['link', 'image', 'video'],
                                            ['blockquote', 'code-block'],
                                            ['clean'],
                                        ],
                                    }}
                                    style={{ minHeight: '300px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── 2. Pricing & Inventory ────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <SectionHeader icon={<FiDollarSign size={20} />} title="Pricing & Inventory" color="bg-green-50 text-green-600" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Selling Price *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">৳</span>
                                    <input type="number" name="price" placeholder="0" className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#0B4222] text-base font-bold" value={formData.price} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Original Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">৳</span>
                                    <input type="number" name="originalPrice" placeholder="0" className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#0B4222] text-base font-bold text-red-600" value={formData.originalPrice} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Cost Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">৳</span>
                                    <input type="number" name="costPrice" placeholder="0" className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#0B4222] text-base font-bold text-gray-500" value={formData.costPrice} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1"><FiPercent size={14} /> Discount</label>
                                <input type="number" name="discount" placeholder="Auto" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none text-base font-bold text-orange-600" value={formData.discount} readOnly />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Input label="Current Stock" name="stock" type="number" placeholder="0" value={formData.stock} onChange={handleChange} />
                            <Input label="Low Stock Alert" name="lowStockThreshold" type="number" placeholder="5" value={formData.lowStockThreshold} onChange={handleChange} />
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Unit</label>
                                <select name="unit" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222] cursor-pointer" value={formData.unit} onChange={handleChange}>
                                    <option value="piece">Piece</option>
                                    <option value="kg">Kg</option>
                                    <option value="liter">Liter</option>
                                    <option value="meter">Meter</option>
                                    <option value="set">Set</option>
                                    <option value="pair">Pair</option>
                                    <option value="box">Box</option>
                                </select>
                            </div>
                            <Input label="Weight (grams)" name="weight" type="number" placeholder="0" value={formData.weight} onChange={handleChange} />
                        </div>
                    </div>

                    {/* ── 3. Visual Variants (Colors, Sizes, Material) ─ */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <SectionHeader icon={<FiDroplet size={20} />} title="Colors, Sizes & Material" color="bg-pink-50 text-pink-600" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Colors <span className="text-xs text-gray-400">(comma-separated)</span></label>
                                <input type="text" placeholder="e.g. red, blue, black, white" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222]" value={formData.colors.join(', ')} onChange={(e) => handleArrayChange('colors', e.target.value)} />
                                {formData.colors.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {formData.colors.map((c: string, i: number) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">{c}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Color Hex <span className="text-xs text-gray-400">(comma-separated, e.g. #FF0000, #0000FF)</span></label>
                                <input type="text" placeholder="e.g. #FF0000, #0000FF" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222] font-mono" value={formData.colorHex.join(', ')} onChange={(e) => handleArrayChange('colorHex', e.target.value)} />
                                {formData.colorHex.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {formData.colorHex.map((hex: string, i: number) => (
                                            <div key={i} className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: hex }} title={hex}></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Sizes <span className="text-xs text-gray-400">(comma-separated)</span></label>
                                <input type="text" placeholder="e.g. S, M, L, XL, XXL" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222]" value={formData.sizes.join(', ')} onChange={(e) => handleArrayChange('sizes', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Material <span className="text-xs text-gray-400">(comma-separated)</span></label>
                                <input type="text" placeholder="e.g. cotton, polyester" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222]" value={formData.material.join(', ')} onChange={(e) => handleArrayChange('material', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Pattern</label>
                                    <select name="pattern" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222] cursor-pointer" value={formData.pattern} onChange={handleChange}>
                                        <option value="">None</option>
                                        <option value="solid">Solid</option>
                                        <option value="striped">Striped</option>
                                        <option value="floral">Floral</option>
                                        <option value="graphic print">Graphic</option>
                                        <option value="embroidered">Embroidered</option>
                                        <option value="camo">Camo</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                                    <select name="gender" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222] cursor-pointer" value={formData.gender} onChange={handleChange}>
                                        <option value="">Any</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="unisex">Unisex</option>
                                        <option value="kids">Kids</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <SectionHeader icon={<FiFileText size={20} />} title="Content Tabs (Product Page)" color="bg-amber-50 text-amber-600" />

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><FiTruck size={14} /> Delivery Information</label>
                                <div className="product-editor-wrapper">
                                    <ReactQuill theme="snow" value={formData.deliveryInfo} onChange={(v: string) => setFormData((prev: any) => ({ ...prev, deliveryInfo: v }))} placeholder="Enter delivery info..." modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link'], ['clean']] }} style={{ minHeight: '120px' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><FiDollarSign size={14} /> Payment Methods</label>
                                <div className="product-editor-wrapper">
                                    <ReactQuill theme="snow" value={formData.paymentInfo} onChange={(v: string) => setFormData((prev: any) => ({ ...prev, paymentInfo: v }))} placeholder="Enter payment methods..." modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link'], ['clean']] }} style={{ minHeight: '120px' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><FiShield size={14} /> Terms & Conditions</label>
                                <div className="product-editor-wrapper">
                                    <ReactQuill theme="snow" value={formData.termsInfo} onChange={(v: string) => setFormData((prev: any) => ({ ...prev, termsInfo: v }))} placeholder="Enter terms and conditions..." modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link'], ['clean']] }} style={{ minHeight: '120px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 7. SEO ─────────────────────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <SectionHeader icon={<FiGlobe size={20} />} title="SEO Optimization" color="bg-orange-50 text-orange-600" />
                        <Input label="Meta Title" name="metaTitle" type="text" placeholder="SEO title for search engines" value={formData.metaTitle} onChange={handleChange} />
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                            <textarea name="metaDescription" rows={3} placeholder="SEO description for better search ranking..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-orange-400 transition-all text-sm" value={formData.metaDescription} onChange={handleChange}></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Keywords <span className="text-xs text-gray-400">(comma-separated)</span></label>
                            <input type="text" placeholder="e.g. air compressor, industrial" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-orange-400" value={formData.metaKeywords.join(', ')} onChange={(e) => handleArrayChange('metaKeywords', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT COLUMN (4 cols) ════════════════════════ */}
                <div className="lg:col-span-4 space-y-6">

                    {/* ── Media Assets ──────────────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiImage className="text-blue-500" /> Media Assets</h3>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Thumbnail URL *</label>
                            <input type="text" name="thumbnail" placeholder="Paste image URL" className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-blue-400 font-mono" value={formData.thumbnail} onChange={handleChange} />
                        </div>
                        <div className="aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                            {formData.thumbnail ? (
                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2 border-2 border-dashed border-gray-200 rounded-md">
                                    <FiImage size={36} />
                                    <p className="text-[10px] font-bold">PREVIEW</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Gallery Images (one per line)</label>
                            <textarea rows={4} placeholder={"/products/product 01/img1.jpg\n/products/product 01/img2.jpg"} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-blue-400 font-mono" value={formData.images.join('\n')} onChange={handleImagesChange}></textarea>
                            {formData.images.length > 0 && (
                                <p className="text-xs text-gray-400">{formData.images.length} images added</p>
                            )}
                        </div>
                    </div>

                    {/* ── Category & Tags ───────────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiTag className="text-indigo-500" /> Organization</h3>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Category *</label>
                            <select name="category" required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-semibold outline-none focus:border-indigo-400 cursor-pointer" value={formData.category} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Tags <span className="text-gray-300">(comma-separated)</span></label>
                            <input type="text" placeholder="e.g. air compressor, industrial, factory" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-indigo-400" value={formData.tags.join(', ')} onChange={(e) => handleArrayChange('tags', e.target.value)} />
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {formData.tags.slice(0, 8).map((t: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">{t}</span>
                                    ))}
                                    {formData.tags.length > 8 && <span className="text-[10px] text-gray-400">+{formData.tags.length - 8} more</span>}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">AI Labels <span className="text-gray-300">(for image search)</span></label>
                            <input type="text" placeholder="e.g. machinery, compressor" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-xs outline-none focus:border-indigo-400" value={formData.aiLabels.join(', ')} onChange={(e) => handleArrayChange('aiLabels', e.target.value)} />
                        </div>
                    </div>

                    {/* ── Visibility & Promotion ────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiSettings className="text-orange-500" /> Visibility & Status</h3>
                        <div className="space-y-2">
                            <Toggle label="Featured Product" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} color="bg-yellow-500" />
                            <Toggle label="On Sale" name="isOnSale" checked={formData.isOnSale} onChange={handleChange} color="bg-rose-500" />
                            <Toggle label="New Arrival" name="isNewProduct" checked={formData.isNewProduct} onChange={handleChange} color="bg-emerald-500" />
                        </div>
                        <div className="pt-2">
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Status</label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {['active', 'draft', 'out-of-stock'].map(s => (
                                    <button key={s} type="button" onClick={() => setFormData((prev: any) => ({ ...prev, status: s }))}
                                        className={`py-2 rounded-md text-xs font-bold uppercase transition-all ${formData.status === s ? 'bg-[#0B4222] text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                        {s === 'out-of-stock' ? 'Out' : s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Shipping & Warranty ───────────────────────── */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2"><FiShield className="text-emerald-500" /> Shipping & Warranty</h3>

                        <div className="space-y-3 p-4 bg-gray-50 rounded-md border border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="shippingConfig.freeShipping" className="w-4 h-4 accent-emerald-500" checked={formData.shippingConfig.freeShipping} onChange={handleChange} />
                                <span className="text-sm font-bold text-gray-700">Free Shipping</span>
                            </label>
                            {!formData.shippingConfig.freeShipping && (
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400">Shipping Cost (৳)</label>
                                        <input type="number" name="shippingConfig.shippingCost" placeholder="0" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-300" value={formData.shippingConfig.shippingCost} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400">Est. Days</label>
                                        <input type="number" name="shippingConfig.estimatedDays" placeholder="3" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-emerald-300" value={formData.shippingConfig.estimatedDays} onChange={handleChange} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 p-4 bg-gray-50 rounded-md border border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="warranty.hasWarranty" className="w-4 h-4 accent-[#0B4222]" checked={formData.warranty.hasWarranty} onChange={handleChange} />
                                <span className="text-sm font-bold text-gray-700">Has Warranty</span>
                            </label>
                            {formData.warranty.hasWarranty && (
                                <div className="grid grid-cols-3 gap-2 pt-1">
                                    <input type="number" name="warranty.duration" placeholder="12" className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-blue-300" value={formData.warranty.duration} onChange={handleChange} />
                                    <select name="warranty.durationUnit" className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-blue-300" value={formData.warranty.durationUnit} onChange={handleChange}>
                                        <option value="days">Days</option>
                                        <option value="months">Months</option>
                                        <option value="years">Years</option>
                                    </select>
                                    <select name="warranty.type" className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-blue-300" value={formData.warranty.type} onChange={handleChange}>
                                        <option value="manufacturer">Manufacturer</option>
                                        <option value="seller">Seller</option>
                                        <option value="brand">Brand</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Dimensions */}
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Dimensions (cm)</label>
                            <div className="grid grid-cols-3 gap-2">
                                <input type="number" name="dimensions.length" placeholder="L" className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222]" value={formData.dimensions.length} onChange={handleChange} />
                                <input type="number" name="dimensions.width" placeholder="W" className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222]" value={formData.dimensions.width} onChange={handleChange} />
                                <input type="number" name="dimensions.height" placeholder="H" className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#0B4222]" value={formData.dimensions.height} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductForm = () => (
    <Suspense fallback={<div className="p-20 text-center text-[#0B4222] font-bold animate-pulse">Loading Product Form...</div>}>
        <ProductFormInner />
    </Suspense>
);

export default ProductForm;
